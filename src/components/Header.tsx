import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import UserProfile from "./UserProfile";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  const navItems = [
    { name: "Home", path: "/" },
    { name: "WorkZone", path: "/workzone" },
    { name: "EduTask", path: "/edutask" },
    { name: "ProjectHub", path: "/projecthub" },
    { name: "BubbleGigs", path: "/bubblegigs" },
    { name: "SkillExchange", path: "/skillexchange" },
    { name: "Ask & Teach", path: "/ask-teach" }
  ];
  
  const isActive = (path: string) => {
    // Special case for home page
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/lovable-uploads/93ab087f-fb9d-4163-8815-d28c78b48250.png" alt="Finitix Logo" className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Finitix<span className="text-primary">Hub</span>
            </h1>
            <div className="text-xs text-muted-foreground -mt-1">begin beyond</div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  active 
                    ? 'text-primary font-semibold' 
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {item.name}
                {active && (
                  <span className="block h-0.5 w-full bg-primary mt-1 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            <Star className="w-3 h-3 fill-primary text-primary" />
            <span>#1 Platform for Skills & Earning</span>
          </div>
          <Link to="/about">
            <Button variant="ghost" size="sm">
              About
            </Button>
          </Link>
          {user ? (
            <UserProfile />
          ) : (
            <>
              <Link to="/signin">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="hero" size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
