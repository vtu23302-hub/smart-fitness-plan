import express from 'express';
import { Response } from 'express';
import pool from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Get all weekly plans for user
router.get('/', authenticateToken, asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;

  const [rows] = await pool.execute(
    'SELECT * FROM workout_meal_plans WHERE user_id = ? ORDER BY FIELD(day, "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")',
    [userId]
  );

  const plans = rows as any[];
  
  // If no plans exist, return empty array instead of generating
  if (plans.length === 0) {
    res.json([]);
  } else {
    const formattedPlans = plans.map(plan => ({
      id: plan.id,
      day: plan.day,
      exercises: typeof plan.exercises === 'string' ? JSON.parse(plan.exercises) : plan.exercises,
      meals: typeof plan.meals === 'string' ? JSON.parse(plan.meals) : plan.meals,
      completed_status: typeof plan.completed_status === 'string' ? JSON.parse(plan.completed_status || '{"exercises": [], "meals": []}') : plan.completed_status || { exercises: [], meals: [] }
    }));
    res.json(formattedPlans);
  }
}));

// Get plan for specific day
router.get('/:day', authenticateToken, asyncHandler(async (req: AuthRequest, res: Response) => {
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
    exercises: plan.exercises,
    meals: plan.meals,
    completed_status: plan.completed_status || { exercises: [], meals: [] }
  });
}));

// Update plan (mark exercises/meals as completed)
router.put('/:day', authenticateToken, asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const day = req.params.day;
  const { exercises, meals } = req.body;

  if (!exercises || !meals) {
    res.status(400).json({ error: 'Exercises and meals are required' });
    return;
  }

  await pool.execute(
    'UPDATE workout_meal_plans SET exercises = ?, meals = ? WHERE user_id = ? AND day = ?',
    [exercises, meals, userId, day]
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
    exercises: plan.exercises,
    meals: plan.meals,
    completed_status: plan.completed_status || { exercises: [], meals: [] }
  });
}));

export default router;

