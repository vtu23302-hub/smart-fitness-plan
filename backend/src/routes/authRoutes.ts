import express from 'express';
import { registerUser, loginUser } from '../services/authService';
import { generateToken } from '../services/authService';
import { validateRegister, validateLogin } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

router.post('/register', validateRegister, asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  const user = await registerUser(email, password, name);
  const token = generateToken(user.id, user.role);

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  });
}));

router.post('/login', validateLogin, asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await loginUser(email, password);

  if (!user) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const token = generateToken(user.id, user.role);

  res.json({
    message: 'Login successful',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  });
}));

export default router;

