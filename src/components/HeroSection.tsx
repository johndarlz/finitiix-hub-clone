import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  const stats = [
    { value: "50k+", label: "Active Users", color: "text-primary" },
    { value: "₹2Cr+", label: "Earned by Users", color: "text-success" },
    { value: "95%", label: "Success Rate", color: "text-secondary" },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-background via-muted/30 to-accent/20">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <div className="space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Empowering{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Skills, Earning,
              </span>{" "}
              and Innovation
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Learn, earn, teach, and showcase your work on one unified platform. 
              From micro-freelancing to skill bartering, we connect learners, 
              creators, and businesses worldwide.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="hero" size="lg" className="text-lg px-8 py-6">
              Start Earning Today
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              <Play className="w-5 h-5" />
              Explore Platform
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-2xl md:text-3xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative">
          <div className="relative rounded-2xl overflow-hidden shadow-strong">
            <img 
              src={heroImage} 
              alt="Finitix Hub - Students and professionals working together"
              className="w-full h-auto object-cover"
            />
            
            {/* Floating badges */}
            <div className="absolute top-4 right-4 bg-success text-success-foreground px-3 py-1 rounded-full text-sm font-medium shadow-medium">
              💼 WorkZone
            </div>
            <div className="absolute top-20 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-medium">
              🎓 EduTask
            </div>
            <div className="absolute bottom-4 right-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-medium">
              🚀 ProjectHub
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;