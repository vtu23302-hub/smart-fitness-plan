import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockWeeklyPlan } from "@/data/mockData";
import { Utensils, Check, Flame, Apple, Beef, Droplet, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

const mealTypeIcons = {
  breakfast: "🌅",
  lunch: "☀️",
  dinner: "🌙",
  snack: "🍎",
};

const Meals = () => {
  const [selectedDay, setSelectedDay] = useState<typeof weekDays[number]>("Monday");
  const [meals, setMeals] = useState(mockWeeklyPlan);

  const todayPlan = meals.find((p) => p.day === selectedDay);
  const consumedMeals = todayPlan?.meals.filter((m) => m.consumed) || [];
  const totalCalories = todayPlan?.meals.reduce((sum, m) => sum + m.calories, 0) || 0;
  const consumedCalories = consumedMeals.reduce((sum, m) => sum + m.calories, 0);
  const targetCalories = 2400;

  const totalMacros = todayPlan?.meals.reduce(
    (acc, m) => ({
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fat: acc.fat + m.fat,
    }),
    { protein: 0, carbs: 0, fat: 0 }
  ) || { protein: 0, carbs: 0, fat: 0 };

  const toggleMeal = (mealId: string) => {
    setMeals((prev) =>
      prev.map((day) => ({
        ...day,
        meals: day.meals.map((meal) =>
          meal.id === mealId ? { ...meal, consumed: !meal.consumed } : meal
        ),
      }))
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-10 animate-slide-up">
            <h1 className="text-3xl md:text-4xl font-bold font-display mb-2">
              Meal Planner
            </h1>
            <p className="text-muted-foreground">
              Your personalized nutrition plan with calorie tracking
            </p>
          </div>

          {/* Day Selector */}
          <div className="mb-8 overflow-x-auto animate-slide-up" style={{ animationDelay: "100ms" }}>
            <div className="flex gap-2 min-w-max pb-2">
              {weekDays.map((day) => (
                <Button
                  key={day}
                  variant={selectedDay === day ? "default" : "secondary"}
                  className="min-w-[100px]"
                  onClick={() => setSelectedDay(day)}
                >
                  {day.slice(0, 3)}
                </Button>
              ))}
            </div>
          </div>

          {/* Nutrition Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card variant="glow" className="md:col-span-2 animate-slide-up" style={{ animationDelay: "200ms" }}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
                    <Flame className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Calories Today</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold font-display text-gradient">
                        {consumedCalories}
                      </span>
                      <span className="text-muted-foreground">/ {targetCalories} kcal</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-primary transition-all duration-500"
                        style={{ width: `${Math.min((consumedCalories / targetCalories) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {[
              { label: "Protein", value: totalMacros.protein, unit: "g", icon: Beef, color: "text-primary" },
              { label: "Carbs", value: totalMacros.carbs, unit: "g", icon: Apple, color: "text-accent" },
            ].map((macro, index) => (
              <Card
                key={macro.label}
                variant="gradient"
                className="animate-slide-up"
                style={{ animationDelay: `${(index + 3) * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      macro.label === "Protein" ? "bg-primary/10" : "bg-accent/10"
                    )}>
                      <macro.icon className={cn("w-5 h-5", macro.color)} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{macro.label}</p>
                      <p className="text-xl font-bold font-display">
                        {macro.value}{macro.unit}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Meal List */}
          <div className="grid gap-4">
            {todayPlan?.meals.map((meal, index) => (
              <Card
                key={meal.id}
                variant="interactive"
                className={cn(
                  "animate-slide-up transition-all duration-300",
                  meal.consumed && "opacity-60"
                )}
                style={{ animationDelay: `${(index + 5) * 100}ms` }}
                onClick={() => toggleMeal(meal.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <button
                      className={cn(
                        "w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all duration-300",
                        meal.consumed
                          ? "bg-primary border-primary"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      {meal.consumed ? (
                        <Check className="w-5 h-5 text-primary-foreground" />
                      ) : (
                        <span className="text-lg">{mealTypeIcons[meal.type]}</span>
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs uppercase font-medium text-muted-foreground">
                          {meal.type}
                        </span>
                      </div>
                      <h3 className={cn(
                        "font-display font-bold text-lg",
                        meal.consumed && "line-through"
                      )}>
                        {meal.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary">
                        <Flame className="w-4 h-4 text-primary" />
                        <span>{meal.calories} kcal</span>
                      </div>
                      <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-secondary text-muted-foreground">
                        <span>P: {meal.protein}g</span>
                        <span>C: {meal.carbs}g</span>
                        <span>F: {meal.fat}g</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Meals;
