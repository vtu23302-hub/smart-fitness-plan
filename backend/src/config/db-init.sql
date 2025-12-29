-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS smart_fitness CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE smart_fitness;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INT,
  gender ENUM('male', 'female', 'other'),
  height DECIMAL(5,2) COMMENT 'Height in cm',
  weight DECIMAL(5,2) COMMENT 'Weight in kg',
  goal ENUM('weight_loss', 'muscle_gain', 'maintenance') NOT NULL DEFAULT 'maintenance',
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'trainer', 'admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- WorkoutMealPlans Table (combines workouts and meals)
CREATE TABLE IF NOT EXISTS workout_meal_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  day ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
  exercises JSON NOT NULL COMMENT 'Array of exercise objects',
  meals JSON NOT NULL COMMENT 'Array of meal objects with calories',
  completed_status JSON DEFAULT NULL COMMENT 'Tracks completed exercises/meals',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_day (user_id, day),
  INDEX idx_user_id (user_id),
  INDEX idx_day (day)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

