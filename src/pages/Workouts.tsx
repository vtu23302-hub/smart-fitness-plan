import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockWeeklyPlan } from "@/data/mockData";
import { Dumbbell, Check, Clock, Flame, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

const Workouts = () => {
  const [selectedDay, setSelectedDay] = useState<typeof weekDays[number]>("Monday");
  const [exercises, setExercises] = useState(mockWeeklyPlan);

  const todayPlan = exercises.find((p) => p.day === selectedDay);
  const completedCount = todayPlan?.exercises.filter((e) => e.completed).length || 0;
  const totalCount = todayPlan?.exercises.length || 0;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const toggleExercise = (exerciseId: string) => {
    setExercises((prev) =>
      prev.map((day) => ({
        ...day,
        exercises: day.exercises.map((ex) =>
          ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
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
              Workout Routines
            </h1>
            <p className="text-muted-foreground">
              Your personalized weekly workout plan
            </p>
          </div>

          {/* Day Selector */}
          <div className="mb-8 overflow-x-auto animate-slide-up" style={{ animationDelay: "100ms" }}>
            <div className="flex gap-2 min-w-max pb-2">
              {weekDays.map((day) => {
                const dayPlan = exercises.find((p) => p.day === day);
                const dayCompleted = dayPlan?.exercises.filter((e) => e.completed).length || 0;
                const dayTotal = dayPlan?.exercises.length || 0;
                const isComplete = dayTotal > 0 && dayCompleted === dayTotal;

                return (
                  <Button
                    key={day}
                    variant={selectedDay === day ? "default" : "secondary"}
                    className={cn(
                      "relative min-w-[100px]",
                      isComplete && selectedDay !== day && "border-primary/50"
                    )}
                    onClick={() => setSelectedDay(day)}
                  >
                    {day.slice(0, 3)}
                    {isComplete && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-primary-foreground" />
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Progress Card */}
          <Card variant="glow" className="mb-8 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
                    <Dumbbell className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-display">{selectedDay}'s Workout</h2>
                    <p className="text-muted-foreground">
                      {completedCount} of {totalCount} exercises completed
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold font-display text-gradient">
                      {Math.round(progress)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Progress</div>
                  </div>
                  <div className="w-32 h-3 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-primary transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exercise List */}
          <div className="grid gap-4">
            {todayPlan?.exercises.map((exercise, index) => (
              <Card
                key={exercise.id}
                variant="interactive"
                className={cn(
                  "animate-slide-up transition-all duration-300",
                  exercise.completed && "opacity-60"
                )}
                style={{ animationDelay: `${(index + 3) * 100}ms` }}
                onClick={() => toggleExercise(exercise.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <button
                      className={cn(
                        "w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all duration-300",
                        exercise.completed
                          ? "bg-primary border-primary"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      {exercise.completed && (
                        <Check className="w-5 h-5 text-primary-foreground" />
                      )}
                    </button>

                    <div className="flex-1">
                      <h3 className={cn(
                        "font-display font-bold text-lg mb-1",
                        exercise.completed && "line-through"
                      )}>
                        {exercise.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {exercise.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      {exercise.sets > 0 && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary">
                          <Flame className="w-4 h-4 text-primary" />
                          <span>{exercise.sets} × {exercise.reps}</span>
                        </div>
                      )}
                      {exercise.duration && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary">
                          <Clock className="w-4 h-4 text-accent" />
                          <span>{exercise.duration} min</span>
                        </div>
                      )}
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

export default Workouts;
