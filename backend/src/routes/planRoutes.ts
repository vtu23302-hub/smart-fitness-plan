import express from 'express';
import pool from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { generateWorkoutPlans, generateMealPlans, combineWorkoutAndMealPlans } from '../services/planGenerator';

const router = express.Router();

// Get all weekly plans for user
router.get('/', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.userId!;

  const [rows] = await pool.execute(
    'SELECT * FROM workout_meal_plans WHERE user_id = ? ORDER BY FIELD(day, "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")',
    [userId]
  );

  const plans = rows as any[];
  
  // If no plans exist, generate default plans
  if (plans.length === 0) {
    const [userRows] = await pool.execute('SELECT goal FROM users WHERE id = ?', [userId]);
    const users = userRows as any[];
    const profile = { fitness_goal: users[0]?.goal || 'maintenance' };

    const workoutPlans = generateWorkoutPlans(profile);
    const mealPlans = generateMealPlans(profile);
    const combinedPlans = combineWorkoutAndMealPlans(workoutPlans, mealPlans);

    for (const plan of combinedPlans) {
      await pool.execute(
        'INSERT INTO workout_meal_plans (user_id, day, exercises, meals, completed_status) VALUES (?, ?, ?, ?, ?)',
        [userId, plan.day, JSON.stringify(plan.exercises), JSON.stringify(plan.meals), JSON.stringify({ exercises: [], meals: [] })]
      );
    }

    // Fetch again
    const [newRows] = await pool.execute(
      'SELECT * FROM workout_meal_plans WHERE user_id = ? ORDER BY FIELD(day, "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")',
      [userId]
    );
    
    const formattedPlans = (newRows as any[]).map(plan => ({
      id: plan.id,
      day: plan.day,
      exercises: JSON.parse(plan.exercises),
      meals: JSON.parse(plan.meals),
      completed_status: JSON.parse(plan.completed_status || '{"exercises": [], "meals": []}')
    }));

    res.json(formattedPlans);
    return;
  }

  const formattedPlans = plans.map(plan => ({
    id: plan.id,
    day: plan.day,
    exercises: JSON.parse(plan.exercises),
    meals: JSON.parse(plan.meals),
    completed_status: JSON.parse(plan.completed_status || '{"exercises": [], "meals": []}')
  }));

  res.json(formattedPlans);
}));

// Get plan for specific day
router.get('/:day', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const day = req.params.day;

  const [rows] = await pool.execute(
    'SELECT * FROM workout_meal_plans WHERE user_id = ? AND day = ?',
    [userId, day]
  );

  const plans = rows as any[];
  if (plans.length === 0) {
    res.status(404).json({ error: 'Plan not found for this day' });
    return;
  }

  const plan = plans[0];
  res.json({
    id: plan.id,
    day: plan.day,
    exercises: JSON.parse(plan.exercises),
    meals: JSON.parse(plan.meals),
    completed_status: JSON.parse(plan.completed_status || '{"exercises": [], "meals": []}')
  });
}));

// Update plan (mark exercises/meals as completed)
router.put('/:day', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const day = req.params.day;
  const { exercises, meals } = req.body;

  if (!exercises || !meals) {
    res.status(400).json({ error: 'Exercises and meals are required' });
    return;
  }

  await pool.execute(
    'UPDATE workout_meal_plans SET exercises = ?, meals = ? WHERE user_id = ? AND day = ?',
    [JSON.stringify(exercises), JSON.stringify(meals), userId, day]
  );

  const [rows] = await pool.execute(
    'SELECT * FROM workout_meal_plans WHERE user_id = ? AND day = ?',
    [userId, day]
  );

  const plans = rows as any[];
  const plan = plans[0];
  
  res.json({
    id: plan.id,
    day: plan.day,
    exercises: JSON.parse(plan.exercises),
    meals: JSON.parse(plan.meals),
    completed_status: JSON.parse(plan.completed_status || '{"exercises": [], "meals": []}')
  });
}));

export default router;

