-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  age INTEGER,
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  fitness_goal TEXT,
  activity_level TEXT,
  dietary_preferences TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workout_plans table
CREATE TABLE public.workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_of_week TEXT NOT NULL,
  exercises JSONB NOT NULL DEFAULT '[]',
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meal_plans table  
CREATE TABLE public.meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_of_week TEXT NOT NULL,
  meals JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create progress_entries table
CREATE TABLE public.progress_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  weight DECIMAL(5,2),
  calories_consumed INTEGER,
  calories_burned INTEGER,
  workouts_completed INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_entries ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS policies for workout_plans
CREATE POLICY "Users can view their own workout plans" ON public.workout_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout plans" ON public.workout_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout plans" ON public.workout_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout plans" ON public.workout_plans
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for meal_plans
CREATE POLICY "Users can view their own meal plans" ON public.meal_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meal plans" ON public.meal_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meal plans" ON public.meal_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meal plans" ON public.meal_plans
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for progress_entries
CREATE POLICY "Users can view their own progress" ON public.progress_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON public.progress_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.progress_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress" ON public.progress_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workout_plans_updated_at
  BEFORE UPDATE ON public.workout_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meal_plans_updated_at
  BEFORE UPDATE ON public.meal_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();