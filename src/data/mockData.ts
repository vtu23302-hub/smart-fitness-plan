import { DailyPlan, UserProfile, ProgressEntry } from "@/types/fitness";

export const mockUser: UserProfile = {
  id: "1",
  name: "Alex Johnson",
  age: 28,
  gender: "male",
  height: 175,
  weight: 78,
  goal: "muscle_gain",
  createdAt: new Date("2024-01-15"),
};

export const mockWeeklyPlan: DailyPlan[] = [
  {
    id: "1",
    userId: "1",
    day: "Monday",
    exercises: [
      { id: "e1", name: "Bench Press", sets: 4, reps: 10, description: "Flat bench with barbell", completed: true },
      { id: "e2", name: "Incline Dumbbell Press", sets: 3, reps: 12, description: "45° incline angle", completed: true },
      { id: "e3", name: "Cable Flyes", sets: 3, reps: 15, description: "Focus on chest squeeze", completed: false },
      { id: "e4", name: "Tricep Dips", sets: 3, reps: 12, description: "Bodyweight or assisted", completed: false },
    ],
    meals: [
      { id: "m1", name: "Protein Oatmeal", type: "breakfast", calories: 450, protein: 35, carbs: 55, fat: 12, consumed: true },
      { id: "m2", name: "Grilled Chicken Salad", type: "lunch", calories: 520, protein: 45, carbs: 25, fat: 20, consumed: true },
      { id: "m3", name: "Salmon with Quinoa", type: "dinner", calories: 650, protein: 50, carbs: 45, fat: 25, consumed: false },
      { id: "m4", name: "Greek Yogurt & Nuts", type: "snack", calories: 280, protein: 20, carbs: 15, fat: 15, consumed: false },
    ],
  },
  {
    id: "2",
    userId: "1",
    day: "Tuesday",
    exercises: [
      { id: "e5", name: "Squats", sets: 4, reps: 8, description: "Barbell back squat", completed: false },
      { id: "e6", name: "Romanian Deadlifts", sets: 3, reps: 10, description: "Focus on hamstrings", completed: false },
      { id: "e7", name: "Leg Press", sets: 4, reps: 12, description: "Feet shoulder-width", completed: false },
      { id: "e8", name: "Calf Raises", sets: 4, reps: 15, description: "Standing or seated", completed: false },
    ],
    meals: [
      { id: "m5", name: "Egg White Scramble", type: "breakfast", calories: 380, protein: 32, carbs: 20, fat: 14, consumed: false },
      { id: "m6", name: "Turkey Wrap", type: "lunch", calories: 480, protein: 38, carbs: 40, fat: 18, consumed: false },
      { id: "m7", name: "Lean Beef Stir-fry", type: "dinner", calories: 580, protein: 48, carbs: 35, fat: 22, consumed: false },
      { id: "m8", name: "Protein Shake", type: "snack", calories: 220, protein: 30, carbs: 8, fat: 5, consumed: false },
    ],
  },
  {
    id: "3",
    userId: "1",
    day: "Wednesday",
    exercises: [
      { id: "e9", name: "Pull-ups", sets: 4, reps: 8, description: "Wide grip", completed: false },
      { id: "e10", name: "Barbell Rows", sets: 4, reps: 10, description: "Overhand grip", completed: false },
      { id: "e11", name: "Lat Pulldowns", sets: 3, reps: 12, description: "Focus on contraction", completed: false },
      { id: "e12", name: "Bicep Curls", sets: 3, reps: 12, description: "Dumbbell or barbell", completed: false },
    ],
    meals: [
      { id: "m9", name: "Smoothie Bowl", type: "breakfast", calories: 420, protein: 28, carbs: 50, fat: 10, consumed: false },
      { id: "m10", name: "Tuna Avocado Bowl", type: "lunch", calories: 550, protein: 42, carbs: 30, fat: 28, consumed: false },
      { id: "m11", name: "Chicken Breast & Veggies", type: "dinner", calories: 520, protein: 52, carbs: 28, fat: 18, consumed: false },
      { id: "m12", name: "Cottage Cheese", type: "snack", calories: 200, protein: 24, carbs: 8, fat: 6, consumed: false },
    ],
  },
  {
    id: "4",
    userId: "1",
    day: "Thursday",
    exercises: [
      { id: "e13", name: "Rest Day", sets: 0, reps: 0, description: "Active recovery - light stretching", completed: false },
    ],
    meals: [
      { id: "m13", name: "Avocado Toast", type: "breakfast", calories: 380, protein: 15, carbs: 35, fat: 22, consumed: false },
      { id: "m14", name: "Mediterranean Bowl", type: "lunch", calories: 520, protein: 30, carbs: 45, fat: 24, consumed: false },
      { id: "m15", name: "Grilled Fish Tacos", type: "dinner", calories: 580, protein: 40, carbs: 48, fat: 20, consumed: false },
      { id: "m16", name: "Mixed Nuts", type: "snack", calories: 250, protein: 8, carbs: 10, fat: 22, consumed: false },
    ],
  },
  {
    id: "5",
    userId: "1",
    day: "Friday",
    exercises: [
      { id: "e14", name: "Overhead Press", sets: 4, reps: 8, description: "Standing barbell", completed: false },
      { id: "e15", name: "Lateral Raises", sets: 3, reps: 15, description: "Controlled movement", completed: false },
      { id: "e16", name: "Face Pulls", sets: 3, reps: 15, description: "Cable machine", completed: false },
      { id: "e17", name: "Shrugs", sets: 3, reps: 12, description: "Dumbbell or barbell", completed: false },
    ],
    meals: [
      { id: "m17", name: "Protein Pancakes", type: "breakfast", calories: 480, protein: 35, carbs: 48, fat: 14, consumed: false },
      { id: "m18", name: "Chicken Caesar Wrap", type: "lunch", calories: 540, protein: 42, carbs: 35, fat: 22, consumed: false },
      { id: "m19", name: "Steak & Sweet Potato", type: "dinner", calories: 680, protein: 52, carbs: 50, fat: 28, consumed: false },
      { id: "m20", name: "Casein Shake", type: "snack", calories: 200, protein: 28, carbs: 6, fat: 4, consumed: false },
    ],
  },
  {
    id: "6",
    userId: "1",
    day: "Saturday",
    exercises: [
      { id: "e18", name: "Deadlifts", sets: 4, reps: 5, description: "Conventional or sumo", completed: false },
      { id: "e19", name: "Leg Curls", sets: 3, reps: 12, description: "Lying machine", completed: false },
      { id: "e20", name: "Hip Thrusts", sets: 3, reps: 12, description: "Barbell or bodyweight", completed: false },
      { id: "e21", name: "Core Circuit", sets: 3, duration: 10, reps: 0, description: "Planks, crunches, leg raises", completed: false },
    ],
    meals: [
      { id: "m21", name: "Full English Breakfast", type: "breakfast", calories: 650, protein: 42, carbs: 40, fat: 35, consumed: false },
      { id: "m22", name: "Poke Bowl", type: "lunch", calories: 580, protein: 38, carbs: 55, fat: 20, consumed: false },
      { id: "m23", name: "Lamb Chops & Salad", type: "dinner", calories: 620, protein: 48, carbs: 20, fat: 38, consumed: false },
      { id: "m24", name: "Protein Bar", type: "snack", calories: 230, protein: 22, carbs: 20, fat: 8, consumed: false },
    ],
  },
  {
    id: "7",
    userId: "1",
    day: "Sunday",
    exercises: [
      { id: "e22", name: "Rest Day", sets: 0, reps: 0, description: "Full recovery - light walk recommended", completed: false },
    ],
    meals: [
      { id: "m25", name: "Veggie Omelette", type: "breakfast", calories: 400, protein: 28, carbs: 12, fat: 26, consumed: false },
      { id: "m26", name: "Grilled Shrimp Salad", type: "lunch", calories: 450, protein: 40, carbs: 18, fat: 24, consumed: false },
      { id: "m27", name: "Roast Chicken Dinner", type: "dinner", calories: 680, protein: 55, carbs: 45, fat: 30, consumed: false },
      { id: "m28", name: "Fruit & Almonds", type: "snack", calories: 200, protein: 6, carbs: 25, fat: 10, consumed: false },
    ],
  },
];

export const mockProgressHistory: ProgressEntry[] = [
  { date: new Date("2024-12-17"), weight: 79.5, caloriesConsumed: 2100, caloriesTarget: 2400, exercisesCompleted: 3, exercisesTotal: 4 },
  { date: new Date("2024-12-18"), weight: 79.3, caloriesConsumed: 2350, caloriesTarget: 2400, exercisesCompleted: 4, exercisesTotal: 4 },
  { date: new Date("2024-12-19"), weight: 79.1, caloriesConsumed: 2280, caloriesTarget: 2400, exercisesCompleted: 4, exercisesTotal: 4 },
  { date: new Date("2024-12-20"), weight: 78.9, caloriesConsumed: 2100, caloriesTarget: 2400, exercisesCompleted: 0, exercisesTotal: 1 },
  { date: new Date("2024-12-21"), weight: 78.7, caloriesConsumed: 2420, caloriesTarget: 2400, exercisesCompleted: 4, exercisesTotal: 4 },
  { date: new Date("2024-12-22"), weight: 78.5, caloriesConsumed: 2550, caloriesTarget: 2400, exercisesCompleted: 4, exercisesTotal: 4 },
  { date: new Date("2024-12-23"), weight: 78.2, caloriesConsumed: 1900, caloriesTarget: 2400, exercisesCompleted: 0, exercisesTotal: 1 },
  { date: new Date("2024-12-24"), weight: 78.0, caloriesConsumed: 1200, caloriesTarget: 2400, exercisesCompleted: 2, exercisesTotal: 4 },
];
