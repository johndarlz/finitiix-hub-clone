import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Search, Play, TrendingUp } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <UserPlus className="w-8 h-8" />,
      title: "Sign Up & Create Profile",
      description: "Join Finitiix Hub for free and set up your profile with skills, interests, and goals.",
      color: "bg-primary text-primary-foreground"
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Explore Opportunities",
      description: "Browse WorkZone jobs, EduTask courses, or create your BubbleGigs. Find what matches your skills.",
      color: "bg-success text-success-foreground"
    },
    {
      icon: <Play className="w-8 h-8" />,
      title: "Start Working & Learning",
      description: "Take on projects, complete courses, teach others, or exchange skills. Start earning immediately.",
      color: "bg-secondary text-secondary-foreground"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Grow Your Career",
      description: "Build your portfolio, gain experience, and watch your earning potential grow exponentially.",
      color: "bg-gradient-primary text-white"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            How{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Finitiix Hub
            </span>{" "}
            Works
          </h2>
          <p className="text-xl text-muted-foreground">
            Get started in minutes and begin your journey to financial independence
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent z-0" 
                     style={{ width: 'calc(100% - 2rem)' }} />
              )}
              
              <Card className="relative z-10 h-full bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto rounded-xl ${step.color} flex items-center justify-center mb-4 shadow-medium relative`}>
                    {step.icon}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-background border-2 border-primary rounded-full flex items-center justify-center text-xs font-bold text-primary">
                      {index + 1}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-muted-foreground leading-relaxed">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;