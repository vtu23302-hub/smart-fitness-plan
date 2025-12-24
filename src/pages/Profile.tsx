import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockUser } from "@/data/mockData";
import { FitnessGoal } from "@/types/fitness";
import { User, Target, Ruler, Scale, Calendar, Save, Check } from "lucide-react";
import { toast } from "sonner";

const goals: { value: FitnessGoal; label: string; description: string }[] = [
  { value: "weight_loss", label: "Weight Loss", description: "Burn fat and slim down" },
  { value: "muscle_gain", label: "Muscle Gain", description: "Build strength and size" },
  { value: "maintenance", label: "Maintenance", description: "Stay fit and healthy" },
];

const Profile = () => {
  const [profile, setProfile] = useState({
    name: mockUser.name,
    age: mockUser.age,
    gender: mockUser.gender,
    height: mockUser.height,
    weight: mockUser.weight,
    goal: mockUser.goal,
  });

  const handleSave = () => {
    toast.success("Profile updated successfully!", {
      description: "Your fitness plan will be adjusted based on your new goals.",
    });
  };

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
                        value={profile.age}
                        onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <div className="flex gap-2">
                      {(["male", "female", "other"] as const).map((g) => (
                        <Button
                          key={g}
                          type="button"
                          variant={profile.gender === g ? "default" : "outline"}
                          size="sm"
                          className="flex-1 capitalize"
                          onClick={() => setProfile({ ...profile, gender: g })}
                        >
                          {g}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <div className="relative">
                      <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="height"
                        type="number"
                        className="pl-10"
                        value={profile.height}
                        onChange={(e) => setProfile({ ...profile, height: parseInt(e.target.value) })}
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
                        value={profile.weight}
                        onChange={(e) => setProfile({ ...profile, weight: parseInt(e.target.value) })}
                      />
                    </div>
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
                      onClick={() => setProfile({ ...profile, goal: goal.value })}
                      className={`relative p-6 rounded-xl border-2 text-left transition-all duration-300 ${
                        profile.goal === goal.value
                          ? "border-primary bg-primary/10 shadow-glow"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      {profile.goal === goal.value && (
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
              <Button variant="hero" size="lg" onClick={handleSave}>
                <Save className="w-5 h-5" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
