import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Code, Palette, TrendingUp, Zap, Target, CheckCircle } from "lucide-react";

const RoadmapsSection = () => {
  const roadmaps = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Full Stack Development",
      description: "Master frontend and backend technologies to become a complete developer",
      duration: "6-8 months",
      difficulty: "Intermediate",
      skills: ["React", "Node.js", "Databases", "APIs"],
      steps: 8,
      color: "from-blue-500 to-cyan-500",
      learners: "12.5k"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "UI/UX Design",
      description: "Learn to create beautiful and user-friendly digital experiences",
      duration: "4-6 months",
      difficulty: "Beginner",
      skills: ["Figma", "Design Thinking", "Prototyping", "User Research"],
      steps: 6,
      color: "from-purple-500 to-pink-500",
      learners: "8.3k"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Digital Marketing",
      description: "Become proficient in modern marketing strategies and tools",
      duration: "3-5 months",
      difficulty: "Beginner",
      skills: ["SEO", "Social Media", "Analytics", "Content Strategy"],
      steps: 5,
      color: "from-orange-500 to-red-500",
      learners: "15.2k"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Data Science",
      description: "Learn to analyze data and build machine learning models",
      duration: "8-10 months",
      difficulty: "Advanced",
      skills: ["Python", "ML", "Statistics", "Data Visualization"],
      steps: 10,
      color: "from-green-500 to-emerald-500",
      learners: "9.7k"
    },
  ];

  const features = [
    {
      icon: <Target className="w-5 h-5" />,
      title: "Structured Learning Path",
      description: "Step-by-step curriculum designed by industry experts"
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Hands-on Projects",
      description: "Build real-world projects to showcase in your portfolio"
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Community Support",
      description: "Connect with mentors and peers throughout your journey"
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-sm px-4 py-2">
            🗺️ Learning Roadmaps
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            Your Path to <span className="bg-gradient-primary bg-clip-text text-transparent">Mastery</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Follow structured learning paths curated by experts to achieve your career goals
          </p>
        </div>

        {/* Roadmaps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {roadmaps.map((roadmap, index) => (
            <Card key={index} className="group hover:shadow-strong transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${roadmap.color}`} />
              <CardHeader>
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${roadmap.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {roadmap.icon}
                </div>
                <CardTitle className="text-xl mb-2">{roadmap.title}</CardTitle>
                <CardDescription className="line-clamp-2">{roadmap.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {roadmap.difficulty}
                    </Badge>
                    <span className="text-muted-foreground">{roadmap.steps} steps</span>
                  </div>
                  <span className="text-muted-foreground">{roadmap.duration}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {roadmap.skills.slice(0, 3).map((skill, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {roadmap.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{roadmap.skills.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {roadmap.learners} learners
                  </span>
                  <Button variant="ghost" size="sm" className="group-hover:text-primary">
                    Start
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-primary">
                  {feature.icon}
                </div>
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" className="text-lg px-8 py-6">
            Explore All Roadmaps
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RoadmapsSection;
