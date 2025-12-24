import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Dumbbell, User, Utensils, TrendingUp, Menu, X, LogOut, LogIn } from "lucide-react";
import { useState } from "react";

const navItems = [
  { path: "/profile", label: "Profile", icon: User },
  { path: "/workouts", label: "Workouts", icon: Dumbbell },
  { path: "/meals", label: "Meal Plan", icon: Utensils },
  { path: "/progress", label: "Progress", icon: TrendingUp },
];

export const Navbar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setMobileOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Dumbbell className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors">
            FitPlan
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          {user && navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "navActive" : "nav"}
                  size="sm"
                  className="gap-2"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
          
          {user ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="gap-2 ml-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="hero" size="sm" className="gap-2 ml-2">
                <LogIn className="w-4 h-4" />
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </nav>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-border/50 animate-slide-up">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {user && navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                >
                  <Button
                    variant={isActive ? "navActive" : "nav"}
                    className="w-full justify-start gap-3"
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
            
            {user ? (
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="w-full justify-start gap-3"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </Button>
            ) : (
              <Link to="/auth" onClick={() => setMobileOpen(false)}>
                <Button variant="hero" className="w-full justify-start gap-3">
                  <LogIn className="w-5 h-5" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
