import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { generateWorkoutPlans, generateMealPlans } from "@/utils/planGenerator";
import { User, Target, Ruler, Scale, Calendar, Save, Check, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const goals = [
  { value: "weight_loss", label: "Weight Loss", description: "Burn fat and slim down" },
  { value: "muscle_gain", label: "Muscle Gain", description: "Build strength and size" },
  { value: "maintenance", label: "Maintenance", description: "Stay fit and healthy" },
];

const activityLevels = [
  { value: "sedentary", label: "Sedentary" },
  { value: "light", label: "Lightly Active" },
  { value: "moderate", label: "Moderately Active" },
  { value: "active", label: "Very Active" },
];

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [originalGoal, setOriginalGoal] = useState("");
  const [profile, setProfile] = useState({
    name: "",
    age: 0,
    height: 0,
    weight: 0,
    fitness_goal: "maintenance",
    activity_level: "moderate",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const profileData = {
          name: data.name || "",
          age: data.age || 0,
          height: Number(data.height) || 0,
          weight: Number(data.weight) || 0,
          fitness_goal: data.fitness_goal || "maintenance",
          activity_level: data.activity_level || "moderate",
        };
        setProfile(profileData);
        setOriginalGoal(data.fitness_goal || "maintenance");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: profile.name,
          age: profile.age || null,
          height: profile.height || null,
          weight: profile.weight || null,
          fitness_goal: profile.fitness_goal,
          activity_level: profile.activity_level,
        })
        .eq("id", user.id);

      if (error) throw error;

      // If fitness goal changed, offer to regenerate plans
      if (originalGoal !== profile.fitness_goal) {
        toast.success("Profile updated!", {
          description: "Your goal changed. Click 'Regenerate Plans' to update your workout and meal plans.",
          duration: 6000,
        });
        setOriginalGoal(profile.fitness_goal);
      } else {
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const regeneratePlans = async () => {
    if (!user) return;
    setRegenerating(true);

    try {
      // Delete existing plans
      await supabase.from("workout_plans").delete().eq("user_id", user.id);
      await supabase.from("meal_plans").delete().eq("user_id", user.id);

      // Generate new workout plans
      const workoutPlans = generateWorkoutPlans({
        fitness_goal: profile.fitness_goal,
        activity_level: profile.activity_level,
      });

      const workoutData = workoutPlans.map((day) => ({
        user_id: user.id,
        day_of_week: day.day,
        exercises: JSON.parse(JSON.stringify(day.exercises)),
        completed: false,
      }));

      await supabase.from("workout_plans").insert(workoutData);

      // Generate new meal plans
      const mealPlans = generateMealPlans({
        fitness_goal: profile.fitness_goal,
        activity_level: profile.activity_level,
      });

      const mealData = mealPlans.map((day) => ({
        user_id: user.id,
        day_of_week: day.day,
        meals: JSON.parse(JSON.stringify(day.meals)),
      }));

      await supabase.from("meal_plans").insert(mealData);

      toast.success("Plans regenerated!", {
        description: `Your workout and meal plans are now optimized for ${profile.fitness_goal.replace("_", " ")}.`,
      });
    } catch (error) {
      console.error("Error regenerating plans:", error);
      toast.error("Failed to regenerate plans. Please try again.");
    } finally {
      setRegenerating(false);
    }
  };

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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-10 animate-slide-up">
            <h1 className="text-3xl md:text-4xl font-bold font-display mb-2">
              Your Profile
            </h1>
            <p className="text-muted-foreground">
              Manage your personal information and fitness goals
            </p>
          </div>

          <div className="grid gap-6">
            {/* Personal Information */}
            <Card variant="gradient" className="animate-slide-up" style={{ animationDelay: "100ms" }}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your basic details</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="age"
                        type="number"
                        className="pl-10"
                        value={profile.age || ""}
                        onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
                        placeholder="Your age"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <div className="relative">
                      <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="height"
                        type="number"
                        className="pl-10"
                        value={profile.height || ""}
                        onChange={(e) => setProfile({ ...profile, height: parseInt(e.target.value) || 0 })}
                        placeholder="Height in cm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <div className="relative">
                      <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="weight"
                        type="number"
                        className="pl-10"
                        value={profile.weight || ""}
                        onChange={(e) => setProfile({ ...profile, weight: parseInt(e.target.value) || 0 })}
                        placeholder="Weight in kg"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Activity Level</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {activityLevels.map((level) => (
                      <Button
                        key={level.value}
                        type="button"
                        variant={profile.activity_level === level.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setProfile({ ...profile, activity_level: level.value })}
                      >
                        {level.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fitness Goal */}
            <Card variant="gradient" className="animate-slide-up" style={{ animationDelay: "200ms" }}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <CardTitle>Fitness Goal</CardTitle>
                    <CardDescription>Choose your primary objective</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {goals.map((goal) => (
                    <button
                      key={goal.value}
                      onClick={() => setProfile({ ...profile, fitness_goal: goal.value })}
                      className={`relative p-6 rounded-xl border-2 text-left transition-all duration-300 ${
                        profile.fitness_goal === goal.value
                          ? "border-primary bg-primary/10 shadow-glow"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      {profile.fitness_goal === goal.value && (
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                      <h3 className="font-display font-bold text-lg mb-1">{goal.label}</h3>
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 animate-slide-up" style={{ animationDelay: "300ms" }}>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={regeneratePlans} 
                disabled={regenerating || saving}
              >
                {regenerating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <RefreshCw className="w-5 h-5" />
                )}
                {regenerating ? "Regenerating..." : "Regenerate Plans"}
              </Button>
              <Button variant="hero" size="lg" onClick={handleSave} disabled={saving || regenerating}>
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
