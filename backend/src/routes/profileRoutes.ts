import express from 'express';
import pool from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validateProfile } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { generateWorkoutPlans, generateMealPlans, combineWorkoutAndMealPlans } from '../services/planGenerator';

const router = express.Router();

// Get user profile
router.get('/', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.userId!;

  const [rows] = await pool.execute(
    'SELECT id, name, age, gender, height, weight, goal, email, role, created_at FROM users WHERE id = ?',
    [userId]
  );

  const users = rows as any[];
  if (users.length === 0) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json(users[0]);
}));

// Update user profile
router.put('/', authenticateToken, validateProfile, asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const { name, age, gender, height, weight, goal } = req.body;

  await pool.execute(
    'UPDATE users SET name = ?, age = ?, gender = ?, height = ?, weight = ?, goal = ? WHERE id = ?',
    [name, age || null, gender || null, height || null, weight || null, goal, userId]
  );

  const [rows] = await pool.execute(
    'SELECT id, name, age, gender, height, weight, goal, email, role, created_at FROM users WHERE id = ?',
    [userId]
  );

  const users = rows as any[];
  res.json(users[0]);
}));

// Regenerate workout and meal plans
router.post('/regenerate-plans', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.userId!;

  // Get user profile for plan generation
  const [userRows] = await pool.execute(
    'SELECT goal FROM users WHERE id = ?',
    [userId]
  );

  const users = userRows as any[];
  if (users.length === 0) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const profile = { fitness_goal: users[0].goal || 'maintenance' };

  // Generate plans
  const workoutPlans = generateWorkoutPlans(profile);
  const mealPlans = generateMealPlans(profile);
  const combinedPlans = combineWorkoutAndMealPlans(workoutPlans, mealPlans);

  // Delete existing plans
  await pool.execute('DELETE FROM workout_meal_plans WHERE user_id = ?', [userId]);

  // Insert new plans
  for (const plan of combinedPlans) {
    await pool.execute(
      'INSERT INTO workout_meal_plans (user_id, day, exercises, meals, completed_status) VALUES (?, ?, ?, ?, ?)',
      [userId, plan.day, JSON.stringify(plan.exercises), JSON.stringify(plan.meals), JSON.stringify({ exercises: [], meals: [] })]
    );
  }

  res.json({ message: 'Plans regenerated successfully' });
}));

export default router;

