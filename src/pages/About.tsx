import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, Zap, Heart, Globe, Star } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Driven",
      description: "Connect with thousands of skilled professionals and learners in our vibrant community."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Goal Oriented",
      description: "Achieve your career and learning objectives with our structured platform approach."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Quality Assured",
      description: "All projects and tasks are reviewed to ensure high-quality deliverables."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Fast & Efficient",
      description: "Quick turnaround times with streamlined processes for maximum productivity."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Passion Focused",
      description: "Follow your passion while earning money and developing new skills."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Reach",
      description: "Connect with opportunities and talent from around the world."
    }
  ];

  const stats = [
    { value: "50K+", label: "Active Users" },
    { value: "25K+", label: "Projects Completed" },
    { value: "₹10M+", label: "Total Earnings" },
    { value: "4.9", label: "Average Rating" }
  ];

  const modules = [
    {
      name: "WorkZone",
      description: "Micro freelance jobs platform for quick tasks and projects",
      color: "bg-blue-500"
    },
    {
      name: "EduTask",
      description: "Educational assignments and learning opportunities",
      color: "bg-green-500"
    },
    {
      name: "ProjectHub",
      description: "Collaborate on larger projects with teams and individuals",
      color: "bg-purple-500"
    },
    {
      name: "BubbleGigs",
      description: "Creative and artistic projects for designers and creators",
      color: "bg-pink-500"
    },
    {
      name: "SkillExchange",
      description: "Learn and teach skills through peer-to-peer exchanges",
      color: "bg-orange-500"
    },
    {
      name: "Ask & Teach",
      description: "Q&A platform for knowledge sharing and mentorship",
      color: "bg-indigo-500"
    }
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                About{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Finitix
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Empowering individuals to <strong>begin beyond</strong> their limits through skills, 
                collaboration, and endless opportunities for growth and earning.
              </p>
              <div className="flex items-center justify-center gap-2 mb-8">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground ml-2">
                  Trusted by 50,000+ users worldwide
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                At Finitix, we believe everyone has the potential to <strong>begin beyond</strong> their current 
                circumstances. Our platform creates opportunities for individuals to monetize their skills, 
                learn new ones, and build meaningful connections in a collaborative ecosystem.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Whether you're a student looking to earn while learning, a professional seeking side projects, 
                or someone wanting to share knowledge - Finitix provides the tools and community to help you thrive.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-card">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Finitix?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-medium transition-all duration-300">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-white">
                        {feature.icon}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Modules */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Platform Modules</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module, index) => (
                <Card key={index} className="hover:shadow-medium transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${module.color}`}></div>
                      <CardTitle className="text-lg">{module.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{module.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <Badge variant="secondary" className="px-2 py-1">01</Badge>
                      Innovation First
                    </h3>
                    <p className="text-muted-foreground">
                      We constantly evolve our platform to meet the changing needs of our community 
                      and embrace new technologies that enhance user experience.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <Badge variant="secondary" className="px-2 py-1">02</Badge>
                      Trust & Transparency
                    </h3>
                    <p className="text-muted-foreground">
                      We maintain the highest standards of security and transparency in all transactions 
                      and interactions on our platform.
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <Badge variant="secondary" className="px-2 py-1">03</Badge>
                      Community Impact
                    </h3>
                    <p className="text-muted-foreground">
                      Every feature we build aims to create positive impact in our users' lives 
                      and contribute to their personal and professional growth.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <Badge variant="secondary" className="px-2 py-1">04</Badge>
                      Inclusivity & Access
                    </h3>
                    <p className="text-muted-foreground">
                      We believe in equal opportunities for all and strive to make our platform 
                      accessible to users from diverse backgrounds and skill levels.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default About;