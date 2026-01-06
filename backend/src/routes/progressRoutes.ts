import express from 'express';
import { Response } from 'express';
import pool from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Get progress data (aggregated from workout_meal_plans)
router.get('/', authenticateToken, asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;

  // Get all plans for the user
  const [rows] = await pool.execute(
    'SELECT * FROM workout_meal_plans WHERE user_id = ?',
    [userId]
  );

  const plans = rows as any[];
  
  // Calculate progress metrics
  const progressData = plans.map(plan => {
    const exercises = typeof plan.exercises === 'string' ? JSON.parse(plan.exercises) : plan.exercises;
    const meals = typeof plan.meals === 'string' ? JSON.parse(plan.meals) : plan.meals;
    const completedStatus = typeof plan.completed_status === 'string' ? JSON.parse(plan.completed_status || '{"exercises": [], "meals": []}') : plan.completed_status || { exercises: [], meals: [] };

    const completedExercises = exercises.filter((ex: any) => completedStatus.exercises?.includes(ex.id) || ex.completed).length;
    const totalExercises = exercises.length;
    const completedMeals = meals.filter((meal: any) => completedStatus.meals?.includes(meal.id) || meal.consumed).length;
    const totalMeals = meals.length;
    const consumedCalories = meals
      .filter((meal: any) => completedStatus.meals?.includes(meal.id) || meal.consumed)
      .reduce((sum: number, meal: any) => sum + (meal.calories || 0), 0);
    const totalCalories = meals.reduce((sum: number, meal: any) => sum + (meal.calories || 0), 0);

    return {
      day: plan.day,
      date: plan.updated_at,
      exercises_completed: completedExercises,
      exercises_total: totalExercises,
      meals_completed: completedMeals,
      meals_total: totalMeals,
      calories_consumed: consumedCalories,
      calories_target: totalCalories,
      exercise_completion_rate: totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0
    };
  });

  res.json(progressData);
}));

// Get user stats (weight, goal, etc.)
router.get('/stats', authenticateToken, asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;

  const [userRows] = await pool.execute(
    'SELECT weight, goal FROM users WHERE id = ?',
    [userId]
  );

  const users = userRows as any[];
  if (users.length === 0) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const user = users[0];

  // Get all plans for aggregate stats
  const [planRows] = await pool.execute(
    'SELECT * FROM workout_meal_plans WHERE user_id = ?',
    [userId]
  );

  const plans = planRows as any[];
  
  let totalExercisesCompleted = 0;
  let totalExercises = 0;
  let totalCaloriesConsumed = 0;
  let totalCaloriesTarget = 0;

  plans.forEach(plan => {
    const exercises = typeof plan.exercises === 'string' ? JSON.parse(plan.exercises) : plan.exercises;
    const meals = typeof plan.meals === 'string' ? JSON.parse(plan.meals) : plan.meals;
    const completedStatus = typeof plan.completed_status === 'string' ? JSON.parse(plan.completed_status || '{"exercises": [], "meals": []}') : plan.completed_status || { exercises: [], meals: [] };

    totalExercises += exercises.length;
    totalExercisesCompleted += exercises.filter((ex: any) => 
      completedStatus.exercises?.includes(ex.id) || ex.completed
    ).length;

    meals.forEach((meal: any) => {
      totalCaloriesTarget += meal.calories || 0;
      if (completedStatus.meals?.includes(meal.id) || meal.consumed) {
        totalCaloriesConsumed += meal.calories || 0;
      }
    });
  });

  res.json({
    current_weight: user.weight,
    goal: user.goal,
    total_exercises_completed: totalExercisesCompleted,
    total_exercises: totalExercises,
    total_calories_consumed: totalCaloriesConsumed,
    total_calories_target: totalCaloriesTarget,
    exercise_completion_rate: totalExercises > 0 ? (totalExercisesCompleted / totalExercises) * 100 : 0,
    calorie_completion_rate: totalCaloriesTarget > 0 ? (totalCaloriesConsumed / totalCaloriesTarget) * 100 : 0
  });
}));

export default router;

