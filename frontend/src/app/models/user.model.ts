export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  weight?: number;
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance';
  created_at?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  duration?: number;
  description: string;
  completed: boolean;
}

export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  consumed: boolean;
}

export interface DailyPlan {
  id: number;
  day: string;
  exercises: Exercise[];
  meals: Meal[];
  completed_status: {
    exercises: string[];
    meals: string[];
  };
}

export interface ProgressData {
  day: string;
  date: string;
  exercises_completed: number;
  exercises_total: number;
  meals_completed: number;
  meals_total: number;
  calories_consumed: number;
  calories_target: number;
  exercise_completion_rate: number;
}

export interface ProgressStats {
  current_weight: number;
  goal: string;
  total_exercises_completed: number;
  total_exercises: number;
  total_calories_consumed: number;
  total_calories_target: number;
  exercise_completion_rate: number;
  calorie_completion_rate: number;
}

