import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { Dumbbell, Utensils, TrendingUp, Target, ArrowRight, Sparkles } from "lucide-react";

const features = [
  {
    icon: Dumbbell,
    title: "Smart Workouts",
    description: "AI-generated routines tailored to your fitness goals and schedule",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Utensils,
    title: "Meal Planning",
    description: "Personalized nutrition plans with calorie and macro tracking",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Visualize your journey with detailed analytics and insights",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Target,
    title: "Goal-Focused",
    description: "Weight loss, muscle gain, or maintenance - we adapt to you",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[128px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-[128px] animate-pulse-glow" />

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Smart Fitness Planning</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold font-display mb-6 leading-tight">
              Transform Your Body with
              <span className="text-gradient block mt-2">Intelligent Planning</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Personalized workout routines and meal plans designed around your goals. 
              Track progress, stay motivated, achieve results.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/profile">
                <Button variant="hero" size="xl" className="group">
                  Get Started
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/workouts">
                <Button variant="outline" size="xl">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-muted-foreground/50" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
              Everything You Need to
              <span className="text-gradient"> Succeed</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete fitness ecosystem designed to help you reach your goals faster
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                variant="interactive"
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-bold font-display mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <Card variant="gradient" className="overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { value: "500+", label: "Workout Plans" },
                  { value: "1000+", label: "Healthy Recipes" },
                  { value: "50K+", label: "Active Users" },
                  { value: "98%", label: "Success Rate" },
                ].map((stat, index) => (
                  <div
                    key={stat.label}
                    className="text-center animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="text-3xl md:text-5xl font-bold font-display text-gradient mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-6">
              Ready to Start Your
              <span className="text-gradient"> Fitness Journey?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Create your profile today and get your personalized workout and meal plan in minutes.
            </p>
            <Link to="/profile">
              <Button variant="hero" size="xl" className="group">
                Create Your Profile
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg">FitPlan</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Smart Fitness Routine & Meal Planner. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </Layout>
  );
};

export default Index;
