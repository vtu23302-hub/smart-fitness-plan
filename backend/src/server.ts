import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { Request, Response } from 'express';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import planRoutes from './routes/planRoutes';
import progressRoutes from './routes/progressRoutes';
import { errorHandler } from './middleware/errorHandler';

console.log('cwd:', process.cwd());
const envPath = path.join(process.cwd(), '.env');
console.log('env path:', envPath);
dotenv.config({ path: envPath });

// console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/progress', progressRoutes);

// Root route
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Smart Fitness Backend API is running. Use /api/* endpoints.' });
});

// Health check
app.get('/health', (_req: Request, res: Response) => {
  console.log('Health check called');
  res.json({ status: 'ok', message: 'Smart Fitness API is running' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Server started successfully');
});

