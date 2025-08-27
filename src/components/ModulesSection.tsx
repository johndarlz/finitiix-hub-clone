import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Briefcase, 
  GraduationCap, 
  Rocket, 
  Video, 
  ArrowRightLeft, 
  MessageCircleQuestion,
  CheckCircle,
  TrendingUp,
  Clock
} from "lucide-react";

const ModulesSection = () => {
  const modules = [
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "WorkZone",
      subtitle: "Micro Freelance Jobs",
      description: "Post and apply to micro-jobs ranging from ₹50 to ₹5000. Get fast results with secure payments and instant delivery.",
      features: ["Earn instantly", "Secure payments", "Fast delivery"],
      color: "bg-primary text-primary-foreground",
      gradient: "from-primary/10 to-primary/5"
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "EduTask", 
      subtitle: "Learn & Earn",
      description: "Take mini skill courses, pass quizzes, and unlock real-world projects. Build your CV while earning money.",
      features: ["Learn by doing", "Build experience", "Instant earnings"],
      color: "bg-success text-success-foreground",
      gradient: "from-success/10 to-success/5"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "ProjectHub",
      subtitle: "Showcase Your Work", 
      description: "Upload and tag your projects to create a public portfolio. Let companies and recruiters discover your talent.",
      features: ["Public portfolio", "Talent discovery", "Career opportunities"],
      color: "bg-secondary text-secondary-foreground",
      gradient: "from-secondary/10 to-secondary/5"
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "BubbleGigs",
      subtitle: "1-Minute Video Gigs",
      description: "Create 1-minute video pitches for your services. Buyers can scroll, discover, and hire you instantly.",
      features: ["Viral hiring", "Quick pitches", "Instant bookings"],
      color: "bg-gradient-primary text-white",
      gradient: "from-primary/10 to-secondary/5"
    },
    {
      icon: <ArrowRightLeft className="w-8 h-8" />,
      title: "SkillExchange",
      subtitle: "Barter Your Skills",
      description: "Exchange skills without cash or use virtual coins. Post 'I do this, want that' gigs for flexible collaboration.",
      features: ["Work without cash", "Skill bartering", "Virtual currency"],
      color: "bg-gradient-to-r from-primary to-secondary text-white",
      gradient: "from-accent/20 to-accent/5"
    },
    {
      icon: <MessageCircleQuestion className="w-8 h-8" />,
      title: "Ask & Teach",
      subtitle: "Learn & Mentor",
      description: "Post doubts and get them solved for small amounts. Skilled users can teach, mentor, and earn money.",
      features: ["Quick help", "Affordable learning", "Teaching income"],
      color: "bg-muted text-muted-foreground border-2 border-primary/20",
      gradient: "from-muted/50 to-background"
    }
  ];

  const quickStats = [
    { icon: <TrendingUp className="w-5 h-5" />, value: "50-5000", label: "Earning Range" },
    { icon: <Clock className="w-5 h-5" />, value: "1-60", label: "Minutes to Complete" },
    { icon: <CheckCircle className="w-5 h-5" />, value: "50K+", label: "Active Users" },
    { icon: <MessageCircleQuestion className="w-5 h-5" />, value: "24/7", label: "Support Available" }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Six Powerful Modules,{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              One Platform
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to learn, earn, teach, and grow your career in one unified ecosystem
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {modules.map((module, index) => (
            <Card key={index} className={`group hover:shadow-strong transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br ${module.gradient} border-0 shadow-soft overflow-hidden`}>
              <CardHeader className="pb-4">
                <div className={`w-16 h-16 rounded-xl ${module.color} flex items-center justify-center mb-4 shadow-medium`}>
                  {module.icon}
                </div>
                <CardTitle className="text-xl font-bold">{module.title}</CardTitle>
                <CardDescription className="text-primary font-medium">
                  {module.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  {module.description}
                </p>
                
                <div className="space-y-2">
                  {module.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Link 
                  to={module.title === 'Ask & Teach' 
                    ? '/ask-teach' 
                    : `/${module.title.toLowerCase().replace(/\s+/g, '-')}`} 
                  className="w-full"
                >
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                  >
                    Explore {module.title}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-card rounded-xl shadow-soft hover:shadow-medium transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-3">
                <div className="text-white">
                  {stat.icon}
                </div>
              </div>
              <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModulesSection;
