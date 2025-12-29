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
  day: string;
  exercises: Exercise[];
  meals: Meal[];
}

interface Profile {
  fitness_goal?: string;
  activity_level?: string;
}

const exerciseTemplates: Record<string, Exercise[]> = {
  weight_loss: [
    { id: 'e1', name: 'HIIT Cardio', sets: 3, reps: 0, duration: 10, description: 'High intensity intervals', completed: false },
    { id: 'e2', name: 'Jump Squats', sets: 3, reps: 15, description: 'Explosive lower body', completed: false },
    { id: 'e3', name: 'Burpees', sets: 3, reps: 12, description: 'Full body cardio', completed: false },
    { id: 'e4', name: 'Mountain Climbers', sets: 3, reps: 0, duration: 5, description: 'Core and cardio', completed: false },
  ],
  muscle_gain: [
    { id: 'e1', name: 'Bench Press', sets: 4, reps: 8, description: 'Flat bench with barbell', completed: false },
    { id: 'e2', name: 'Incline Dumbbell Press', sets: 3, reps: 10, description: '45° incline angle', completed: false },
    { id: 'e3', name: 'Cable Flyes', sets: 3, reps: 12, description: 'Focus on chest squeeze', completed: false },
    { id: 'e4', name: 'Tricep Dips', sets: 3, reps: 12, description: 'Bodyweight or assisted', completed: false },
  ],
  maintenance: [
    { id: 'e1', name: 'Push-ups', sets: 3, reps: 15, description: 'Standard form', completed: false },
    { id: 'e2', name: 'Bodyweight Squats', sets: 3, reps: 20, description: 'Controlled movement', completed: false },
    { id: 'e3', name: 'Plank Hold', sets: 3, reps: 0, duration: 1, description: '60 second holds', completed: false },
    { id: 'e4', name: 'Lunges', sets: 3, reps: 12, description: 'Alternating legs', completed: false },
  ],
};

const legExercises: Record<string, Exercise[]> = {
  weight_loss: [
    { id: 'e5', name: 'Jump Rope', sets: 3, reps: 0, duration: 5, description: 'Continuous jumping', completed: false },
    { id: 'e6', name: 'Walking Lunges', sets: 3, reps: 20, description: 'Cardio focus', completed: false },
    { id: 'e7', name: 'Box Jumps', sets: 3, reps: 12, description: 'Explosive power', completed: false },
    { id: 'e8', name: 'High Knees', sets: 3, reps: 0, duration: 3, description: 'Quick feet', completed: false },
  ],
  muscle_gain: [
    { id: 'e5', name: 'Squats', sets: 4, reps: 8, description: 'Barbell back squat', completed: false },
    { id: 'e6', name: 'Romanian Deadlifts', sets: 3, reps: 10, description: 'Focus on hamstrings', completed: false },
    { id: 'e7', name: 'Leg Press', sets: 4, reps: 12, description: 'Heavy weight', completed: false },
    { id: 'e8', name: 'Calf Raises', sets: 4, reps: 15, description: 'Standing', completed: false },
  ],
  maintenance: [
    { id: 'e5', name: 'Goblet Squats', sets: 3, reps: 15, description: 'Dumbbell held at chest', completed: false },
    { id: 'e6', name: 'Step-ups', sets: 3, reps: 12, description: 'Alternating legs', completed: false },
    { id: 'e7', name: 'Wall Sit', sets: 3, reps: 0, duration: 1, description: '45 second holds', completed: false },
    { id: 'e8', name: 'Glute Bridges', sets: 3, reps: 15, description: 'Squeeze at top', completed: false },
  ],
};

const backExercises: Record<string, Exercise[]> = {
  weight_loss: [
    { id: 'e9', name: 'Rowing Machine', sets: 3, reps: 0, duration: 8, description: 'Moderate pace', completed: false },
    { id: 'e10', name: 'Superman Holds', sets: 3, reps: 15, description: 'Lower back focus', completed: false },
    { id: 'e11', name: 'Renegade Rows', sets: 3, reps: 10, description: 'Plank position rows', completed: false },
    { id: 'e12', name: 'Battle Ropes', sets: 3, reps: 0, duration: 2, description: 'Alternating waves', completed: false },
  ],
  muscle_gain: [
    { id: 'e9', name: 'Pull-ups', sets: 4, reps: 8, description: 'Wide grip', completed: false },
    { id: 'e10', name: 'Barbell Rows', sets: 4, reps: 10, description: 'Overhand grip', completed: false },
    { id: 'e11', name: 'Lat Pulldowns', sets: 3, reps: 12, description: 'Focus on contraction', completed: false },
    { id: 'e12', name: 'Bicep Curls', sets: 3, reps: 12, description: 'Dumbbell or barbell', completed: false },
  ],
  maintenance: [
    { id: 'e9', name: 'Assisted Pull-ups', sets: 3, reps: 10, description: 'Machine or bands', completed: false },
    { id: 'e10', name: 'Dumbbell Rows', sets: 3, reps: 12, description: 'One arm at a time', completed: false },
    { id: 'e11', name: 'Face Pulls', sets: 3, reps: 15, description: 'Cable machine', completed: false },
    { id: 'e12', name: 'Reverse Flyes', sets: 3, reps: 12, description: 'Rear deltoids', completed: false },
  ],
};

const getMealsByGoal = (goal: string): Record<string, Meal[]> => {
  const calorieMultiplier = goal === 'weight_loss' ? 0.85 : goal === 'muscle_gain' ? 1.2 : 1;
  const proteinMultiplier = goal === 'muscle_gain' ? 1.3 : 1;

  return {
    monday: [
      { id: 'm1', name: goal === 'weight_loss' ? 'Light Protein Oatmeal' : 'Protein Oatmeal', type: 'breakfast', calories: Math.round(400 * calorieMultiplier), protein: Math.round(30 * proteinMultiplier), carbs: 45, fat: 10, consumed: false },
      { id: 'm2', name: goal === 'weight_loss' ? 'Grilled Chicken Salad' : 'Chicken & Rice Bowl', type: 'lunch', calories: Math.round(500 * calorieMultiplier), protein: Math.round(42 * proteinMultiplier), carbs: goal === 'weight_loss' ? 20 : 45, fat: 18, consumed: false },
      { id: 'm3', name: goal === 'muscle_gain' ? 'Salmon with Quinoa & Veggies' : 'Grilled Salmon', type: 'dinner', calories: Math.round(600 * calorieMultiplier), protein: Math.round(48 * proteinMultiplier), carbs: goal === 'weight_loss' ? 25 : 40, fat: 22, consumed: false },
      { id: 'm4', name: goal === 'muscle_gain' ? 'Greek Yogurt & Almonds' : 'Greek Yogurt', type: 'snack', calories: Math.round(250 * calorieMultiplier), protein: Math.round(20 * proteinMultiplier), carbs: 12, fat: 12, consumed: false },
    ],
    tuesday: [
      { id: 'm5', name: goal === 'weight_loss' ? 'Egg White Omelette' : 'Whole Egg Scramble', type: 'breakfast', calories: Math.round(350 * calorieMultiplier), protein: Math.round(28 * proteinMultiplier), carbs: 15, fat: 12, consumed: false },
      { id: 'm6', name: 'Turkey Wrap', type: 'lunch', calories: Math.round(480 * calorieMultiplier), protein: Math.round(38 * proteinMultiplier), carbs: 35, fat: 16, consumed: false },
      { id: 'm7', name: goal === 'muscle_gain' ? 'Lean Beef Stir-fry with Rice' : 'Lean Beef Stir-fry', type: 'dinner', calories: Math.round(550 * calorieMultiplier), protein: Math.round(45 * proteinMultiplier), carbs: goal === 'weight_loss' ? 28 : 40, fat: 20, consumed: false },
      { id: 'm8', name: 'Protein Shake', type: 'snack', calories: Math.round(200 * calorieMultiplier), protein: Math.round(28 * proteinMultiplier), carbs: 6, fat: 4, consumed: false },
    ],
    wednesday: [
      { id: 'm9', name: goal === 'weight_loss' ? 'Berry Protein Smoothie' : 'Smoothie Bowl', type: 'breakfast', calories: Math.round(380 * calorieMultiplier), protein: Math.round(25 * proteinMultiplier), carbs: 40, fat: 8, consumed: false },
      { id: 'm10', name: 'Tuna Avocado Bowl', type: 'lunch', calories: Math.round(520 * calorieMultiplier), protein: Math.round(40 * proteinMultiplier), carbs: 25, fat: 26, consumed: false },
      { id: 'm11', name: 'Chicken Breast & Veggies', type: 'dinner', calories: Math.round(500 * calorieMultiplier), protein: Math.round(50 * proteinMultiplier), carbs: 22, fat: 16, consumed: false },
      { id: 'm12', name: 'Cottage Cheese', type: 'snack', calories: Math.round(180 * calorieMultiplier), protein: Math.round(22 * proteinMultiplier), carbs: 6, fat: 5, consumed: false },
    ],
    thursday: [
      { id: 'm13', name: goal === 'weight_loss' ? 'Avocado Toast (Light)' : 'Avocado Toast', type: 'breakfast', calories: Math.round(350 * calorieMultiplier), protein: 14, carbs: 30, fat: 20, consumed: false },
      { id: 'm14', name: 'Mediterranean Bowl', type: 'lunch', calories: Math.round(500 * calorieMultiplier), protein: Math.round(28 * proteinMultiplier), carbs: 40, fat: 22, consumed: false },
      { id: 'm15', name: 'Grilled Fish Tacos', type: 'dinner', calories: Math.round(550 * calorieMultiplier), protein: Math.round(38 * proteinMultiplier), carbs: 42, fat: 18, consumed: false },
      { id: 'm16', name: goal === 'weight_loss' ? 'Almonds (Small)' : 'Mixed Nuts', type: 'snack', calories: Math.round(220 * calorieMultiplier), protein: 7, carbs: 8, fat: 18, consumed: false },
    ],
    friday: [
      { id: 'm17', name: 'Protein Pancakes', type: 'breakfast', calories: Math.round(450 * calorieMultiplier), protein: Math.round(32 * proteinMultiplier), carbs: 42, fat: 12, consumed: false },
      { id: 'm18', name: 'Chicken Caesar Wrap', type: 'lunch', calories: Math.round(520 * calorieMultiplier), protein: Math.round(40 * proteinMultiplier), carbs: 32, fat: 20, consumed: false },
      { id: 'm19', name: goal === 'muscle_gain' ? 'Steak & Sweet Potato (Large)' : 'Steak & Sweet Potato', type: 'dinner', calories: Math.round(650 * calorieMultiplier), protein: Math.round(50 * proteinMultiplier), carbs: 45, fat: 26, consumed: false },
      { id: 'm20', name: 'Casein Shake', type: 'snack', calories: Math.round(180 * calorieMultiplier), protein: Math.round(26 * proteinMultiplier), carbs: 5, fat: 3, consumed: false },
    ],
    saturday: [
      { id: 'm21', name: goal === 'weight_loss' ? 'Veggie Omelette' : 'Full English Breakfast', type: 'breakfast', calories: Math.round(550 * calorieMultiplier), protein: Math.round(38 * proteinMultiplier), carbs: 35, fat: 28, consumed: false },
      { id: 'm22', name: 'Poke Bowl', type: 'lunch', calories: Math.round(560 * calorieMultiplier), protein: Math.round(36 * proteinMultiplier), carbs: 50, fat: 18, consumed: false },
      { id: 'm23', name: goal === 'muscle_gain' ? 'Lamb Chops & Salad' : 'Grilled Lamb Cutlets', type: 'dinner', calories: Math.round(600 * calorieMultiplier), protein: Math.round(46 * proteinMultiplier), carbs: 18, fat: 32, consumed: false },
      { id: 'm24', name: 'Protein Bar', type: 'snack', calories: Math.round(210 * calorieMultiplier), protein: Math.round(20 * proteinMultiplier), carbs: 18, fat: 7, consumed: false },
    ],
    sunday: [
      { id: 'm25', name: 'Veggie Omelette', type: 'breakfast', calories: Math.round(380 * calorieMultiplier), protein: Math.round(26 * proteinMultiplier), carbs: 10, fat: 24, consumed: false },
      { id: 'm26', name: 'Grilled Shrimp Salad', type: 'lunch', calories: Math.round(430 * calorieMultiplier), protein: Math.round(38 * proteinMultiplier), carbs: 15, fat: 22, consumed: false },
      { id: 'm27', name: 'Roast Chicken Dinner', type: 'dinner', calories: Math.round(650 * calorieMultiplier), protein: Math.round(52 * proteinMultiplier), carbs: 40, fat: 28, consumed: false },
      { id: 'm28', name: 'Fruit & Almonds', type: 'snack', calories: Math.round(180 * calorieMultiplier), protein: 5, carbs: 22, fat: 8, consumed: false },
    ],
  };
};

export const generateWorkoutPlans = (profile: Profile): DailyPlan[] => {
  const goal = profile.fitness_goal || 'maintenance';
  const goalKey = goal as keyof typeof exerciseTemplates;

  return [
    { day: 'Monday', exercises: exerciseTemplates[goalKey] || exerciseTemplates.maintenance, meals: [] },
    { day: 'Tuesday', exercises: legExercises[goalKey] || legExercises.maintenance, meals: [] },
    { day: 'Wednesday', exercises: backExercises[goalKey] || backExercises.maintenance, meals: [] },
    { day: 'Thursday', exercises: [{ id: 'e13', name: 'Rest Day', sets: 0, reps: 0, description: 'Active recovery - light stretching or walk', completed: false }], meals: [] },
    { day: 'Friday', exercises: exerciseTemplates[goalKey] || exerciseTemplates.maintenance, meals: [] },
    { day: 'Saturday', exercises: legExercises[goalKey] || legExercises.maintenance, meals: [] },
    { day: 'Sunday', exercises: [{ id: 'e22', name: 'Rest Day', sets: 0, reps: 0, description: 'Full recovery - enjoy your day!', completed: false }], meals: [] },
  ];
};

export const generateMealPlans = (profile: Profile): DailyPlan[] => {
  const goal = profile.fitness_goal || 'maintenance';
  const meals = getMealsByGoal(goal);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return days.map((day, index) => ({
    day,
    exercises: [],
    meals: meals[mealKeys[index] as keyof typeof meals] || []
  }));
};

export const combineWorkoutAndMealPlans = (workoutPlans: DailyPlan[], mealPlans: DailyPlan[]): DailyPlan[] => {
  return workoutPlans.map(workoutPlan => {
    const mealPlan = mealPlans.find(mp => mp.day === workoutPlan.day);
    return {
      day: workoutPlan.day,
      exercises: workoutPlan.exercises,
      meals: mealPlan?.meals || []
    };
  });
};

