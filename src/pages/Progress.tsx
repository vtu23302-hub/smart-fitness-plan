import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockProgressHistory, mockUser } from "@/data/mockData";
import { TrendingUp, TrendingDown, Scale, Flame, Dumbbell, Target } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const Progress = () => {
  const chartData = mockProgressHistory.map((entry) => ({
    date: entry.date.toLocaleDateString("en-US", { weekday: "short" }),
    weight: entry.weight,
    calories: entry.caloriesConsumed,
    target: entry.caloriesTarget,
    exerciseRate: Math.round((entry.exercisesCompleted / entry.exercisesTotal) * 100),
  }));

  const latestWeight = mockProgressHistory[mockProgressHistory.length - 1]?.weight || 0;
  const startWeight = mockProgressHistory[0]?.weight || 0;
  const weightChange = startWeight - latestWeight;
  const avgCalories = Math.round(
    mockProgressHistory.reduce((sum, e) => sum + e.caloriesConsumed, 0) / mockProgressHistory.length
  );
  const avgExerciseCompletion = Math.round(
    (mockProgressHistory.reduce((sum, e) => sum + e.exercisesCompleted, 0) /
      mockProgressHistory.reduce((sum, e) => sum + e.exercisesTotal, 0)) *
      100
  );

  const stats = [
    {
      label: "Current Weight",
      value: `${latestWeight} kg`,
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
      value: `${avgExerciseCompletion}%`,
      change: "completion",
      trend: avgExerciseCompletion >= 80 ? "up" : "neutral",
      icon: Dumbbell,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Goal",
      value: mockUser.goal.replace("_", " "),
      change: "active",
      trend: "neutral",
      icon: Target,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

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
