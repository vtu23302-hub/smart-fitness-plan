export type FitnessGoal = "weight_loss" | "muscle_gain" | "maintenance";

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  height: number;
  weight: number;
  goal: FitnessGoal;
  createdAt: Date;
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
  type: "breakfast" | "lunch" | "dinner" | "snack";
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  consumed: boolean;
}

export interface DailyPlan {
  id: string;
  userId: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  exercises: Exercise[];
  meals: Meal[];
}

export interface ProgressEntry {
  date: Date;
  weight: number;
  caloriesConsumed: number;
  caloriesTarget: number;
  exercisesCompleted: number;
  exercisesTotal: number;
}
