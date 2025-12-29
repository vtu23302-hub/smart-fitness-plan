import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  goal?: string;
}

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (userId: number, role: string): string => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'default-secret',
    { expiresIn: '7d' }
  );
};

export const registerUser = async (
  email: string,
  password: string,
  name: string
): Promise<User> => {
  const passwordHash = await hashPassword(password);

  const [result] = await pool.execute(
    'INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)',
    [email, passwordHash, name, 'user']
  );

  const insertResult = result as any;
  const userId = insertResult.insertId;

  const [rows] = await pool.execute(
    'SELECT id, name, email, role FROM users WHERE id = ?',
    [userId]
  );

  const users = rows as User[];
  return users[0];
};

export const loginUser = async (email: string, password: string): Promise<User | null> => {
  const [rows] = await pool.execute(
    'SELECT id, name, email, password_hash, role FROM users WHERE email = ?',
    [email]
  );

  const users = rows as any[];
  if (users.length === 0) {
    return null;
  }

  const user = users[0];
  const isValidPassword = await comparePassword(password, user.password_hash);

  if (!isValidPassword) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
};

export const getUserById = async (userId: number): Promise<User | null> => {
  const [rows] = await pool.execute(
    'SELECT id, name, email, role, goal FROM users WHERE id = ?',
    [userId]
  );

  const users = rows as User[];
  return users.length > 0 ? users[0] : null;
};

