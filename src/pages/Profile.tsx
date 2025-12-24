import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { User, Target, Ruler, Scale, Calendar, Save, Check, Loader2 } from "lucide-react";
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
        setProfile({
          name: data.name || "",
          age: data.age || 0,
          height: Number(data.height) || 0,
          weight: Number(data.weight) || 0,
          fitness_goal: data.fitness_goal || "maintenance",
          activity_level: data.activity_level || "moderate",
        });
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

      toast.success("Profile updated successfully!", {
        description: "Your fitness plan will be adjusted based on your new goals.",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
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

            {/* Save Button */}
            <div className="flex justify-end animate-slide-up" style={{ animationDelay: "300ms" }}>
              <Button variant="hero" size="lg" onClick={handleSave} disabled={saving}>
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
