import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, TrendingDown, Scale, Flame, Dumbbell, Target, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface ProgressEntry {
  id: string;
  date: string;
  weight: number | null;
  calories_consumed: number | null;
  calories_burned: number | null;
  workouts_completed: number;
}

const Progress = () => {
  const { user } = useAuth();
  const [progressHistory, setProgressHistory] = useState<ProgressEntry[]>([]);
  const [profile, setProfile] = useState<{ fitness_goal: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch progress entries
      const { data: progressData, error: progressError } = await supabase
        .from("progress_entries")
        .select("*")
        .eq("user_id", user?.id)
        .order("date", { ascending: true });

      if (progressError) throw progressError;

      // Fetch profile for goal
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("fitness_goal")
        .eq("id", user?.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (progressData && progressData.length > 0) {
        setProgressHistory(progressData);
      } else {
        // Initialize with sample data for new users
        await initializeSampleProgress();
      }

      setProfile(profileData);
    } catch (error) {
      console.error("Error fetching progress data:", error);
    } finally {
      setLoading(false);
    }
  };

  const initializeSampleProgress = async () => {
    const today = new Date();
    const sampleData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      sampleData.push({
        user_id: user?.id,
        date: date.toISOString().split("T")[0],
        weight: 75 + Math.random() * 2 - 1,
        calories_consumed: 1800 + Math.floor(Math.random() * 600),
        calories_burned: 200 + Math.floor(Math.random() * 300),
        workouts_completed: Math.floor(Math.random() * 4),
      });
    }

    try {
      const { data, error } = await supabase
        .from("progress_entries")
        .insert(sampleData)
        .select();

      if (error) throw error;
      if (data) setProgressHistory(data);
    } catch (error) {
      console.error("Error initializing sample progress:", error);
    }
  };

  const chartData = progressHistory.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString("en-US", { weekday: "short" }),
    weight: Number(entry.weight) || 0,
    calories: entry.calories_consumed || 0,
    target: 2200,
    exerciseRate: (entry.workouts_completed / 4) * 100,
  }));

  const latestWeight = progressHistory[progressHistory.length - 1]?.weight || 0;
  const startWeight = progressHistory[0]?.weight || 0;
  const weightChange = Number(startWeight) - Number(latestWeight);
  const avgCalories = progressHistory.length > 0
    ? Math.round(progressHistory.reduce((sum, e) => sum + (e.calories_consumed || 0), 0) / progressHistory.length)
    : 0;
  const avgWorkouts = progressHistory.length > 0
    ? Math.round((progressHistory.reduce((sum, e) => sum + e.workouts_completed, 0) / progressHistory.length) * 25)
    : 0;

  const stats = [
    {
      label: "Current Weight",
      value: `${Number(latestWeight).toFixed(1)} kg`,
      change: weightChange > 0 ? `-${weightChange.toFixed(1)} kg` : `+${Math.abs(weightChange).toFixed(1)} kg`,
      trend: weightChange > 0 ? "down" : "up",
      icon: Scale,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Avg. Calories",
      value: `${avgCalories} kcal`,
      change: "per day",
      trend: "neutral",
      icon: Flame,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "Workout Rate",
      value: `${avgWorkouts}%`,
      change: "completion",
      trend: avgWorkouts >= 80 ? "up" : "neutral",
      icon: Dumbbell,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Goal",
      value: (profile?.fitness_goal || "maintenance").replace("_", " "),
      change: "active",
      trend: "neutral",
      icon: Target,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-10 animate-slide-up">
            <h1 className="text-3xl md:text-4xl font-bold font-display mb-2">
              Progress Tracker
            </h1>
            <p className="text-muted-foreground">
              Track your fitness journey with detailed analytics
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card
                key={stat.label}
                variant="gradient"
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    {stat.trend === "up" && <TrendingUp className="w-4 h-4 text-primary ml-auto" />}
                    {stat.trend === "down" && <TrendingDown className="w-4 h-4 text-accent ml-auto" />}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold font-display capitalize">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weight Chart */}
            <Card variant="gradient" className="animate-slide-up" style={{ animationDelay: "400ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-primary" />
                  Weight Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(142, 70%, 50%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(142, 70%, 50%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 18%)" />
                      <XAxis
                        dataKey="date"
                        stroke="hsl(220, 10%, 60%)"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="hsl(220, 10%, 60%)"
                        fontSize={12}
                        tickLine={false}
                        domain={["dataMin - 1", "dataMax + 1"]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(220, 18%, 10%)",
                          border: "1px solid hsl(220, 18%, 18%)",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "hsl(0, 0%, 98%)" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="weight"
                        stroke="hsl(142, 70%, 50%)"
                        strokeWidth={3}
                        fill="url(#weightGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Calories Chart */}
            <Card variant="gradient" className="animate-slide-up" style={{ animationDelay: "500ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-accent" />
                  Calorie Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 18%)" />
                      <XAxis
                        dataKey="date"
                        stroke="hsl(220, 10%, 60%)"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="hsl(220, 10%, 60%)"
                        fontSize={12}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(220, 18%, 10%)",
                          border: "1px solid hsl(220, 18%, 18%)",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "hsl(0, 0%, 98%)" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="calories"
                        stroke="hsl(185, 70%, 50%)"
                        strokeWidth={3}
                        dot={{ fill: "hsl(185, 70%, 50%)", strokeWidth: 0, r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        stroke="hsl(220, 10%, 40%)"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Exercise Completion Chart */}
            <Card variant="gradient" className="lg:col-span-2 animate-slide-up" style={{ animationDelay: "600ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-primary" />
                  Workout Completion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="exerciseGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(142, 70%, 50%)" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="hsl(142, 70%, 50%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 18%)" />
                      <XAxis
                        dataKey="date"
                        stroke="hsl(220, 10%, 60%)"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="hsl(220, 10%, 60%)"
                        fontSize={12}
                        tickLine={false}
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(220, 18%, 10%)",
                          border: "1px solid hsl(220, 18%, 18%)",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "hsl(0, 0%, 98%)" }}
                        formatter={(value: number) => [`${value}%`, "Completion"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="exerciseRate"
                        stroke="hsl(142, 70%, 50%)"
                        strokeWidth={3}
                        fill="url(#exerciseGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Progress;
