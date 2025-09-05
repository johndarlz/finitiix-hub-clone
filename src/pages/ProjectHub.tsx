import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, Eye, Heart, Share2, Star, ExternalLink, Github, Play, Users, TrendingUp } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import ProjectsSection from "@/components/ProjectsSection";

const ProjectHub = () => {
  const projectCategories = [
    "Web Development", "Mobile Apps", "UI/UX Design", "Data Science", 
    "Machine Learning", "E-commerce", "Game Development", "DevOps"
  ];

  const featuredProjects = [
    {
      title: "E-commerce Mobile App",
      description: "A complete React Native e-commerce app with payment integration, user authentication, and admin panel.",
      creator: "Priya Sharma",
      image: "📱",
      tags: ["React Native", "Firebase", "Stripe"],
      views: 1250,
      likes: 89,
      rating: 4.9,
      liveDemo: true,
      github: true,
      featured: true,
      category: "Mobile Apps"
    },
    {
      title: "AI-Powered Chat Application",
      description: "Real-time chat app with OpenAI integration for smart responses and message summarization.",
      creator: "Rahul Verma",
      image: "🤖",
      tags: ["Next.js", "OpenAI", "Socket.io"],
      views: 980,
      likes: 67,
      rating: 4.8,
      liveDemo: true,
      github: true,
      featured: true,
      category: "Web Development"
    },
    {
      title: "Fitness Tracking Dashboard",
      description: "Beautiful dashboard for tracking workouts, nutrition, and progress with data visualization.",
      creator: "Sneha Patel",
      image: "💪",
      tags: ["Vue.js", "Chart.js", "PWA"],
      views: 750,
      likes: 54,
      rating: 4.7,
      liveDemo: true,
      github: false,
      featured: false,
      category: "Web Development"
    },
    {
      title: "Stock Price Predictor",
      description: "Machine learning model for predicting stock prices with interactive web interface.",
      creator: "Arjun Kumar",
      image: "📈",
      tags: ["Python", "TensorFlow", "Streamlit"],
      views: 1100,
      likes: 78,
      rating: 4.9,
      liveDemo: true,
      github: true,
      featured: true,
      category: "Data Science"
    },
    {
      title: "Task Management System",
      description: "Collaborative project management tool with team features and real-time updates.",
      creator: "Meera Singh",
      image: "📋",
      tags: ["Angular", "Node.js", "MongoDB"],
      views: 650,
      likes: 42,
      rating: 4.6,
      liveDemo: true,
      github: true,
      featured: false,
      category: "Web Development"
    },
    {
      title: "Digital Art Portfolio",
      description: "Stunning portfolio website showcasing digital art with smooth animations and galleries.",
      creator: "Kiran Gupta",
      image: "🎨",
      tags: ["Three.js", "GSAP", "CSS3"],
      views: 890,
      likes: 95,
      rating: 4.8,
      liveDemo: true,
      github: false,
      featured: false,
      category: "UI/UX Design"
    }
  ];

  const quickStats = [
    { icon: <Rocket className="w-5 h-5" />, value: "5,000+", label: "Projects" },
    { icon: <Users className="w-5 h-5" />, value: "2,500+", label: "Creators" },
    { icon: <Eye className="w-5 h-5" />, value: "100K+", label: "Monthly Views" },
    { icon: <TrendingUp className="w-5 h-5" />, value: "85%", label: "Hire Rate" }
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary/10 via-background to-primary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                ProjectHub
              </span>{" "}
              Showcase Your Work
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Upload and tag your projects to create a public portfolio. Let companies and recruiters discover your talent.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button variant="hero" size="lg" className="text-lg px-8 py-6" onClick={() => window.location.href = '/upload-project'}>
                <Rocket className="w-5 h-5" />
                Upload Project
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Explore Projects
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {quickStats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-card rounded-xl shadow-soft">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-lg mx-auto mb-2">
                    <div className="text-white">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-xl font-bold text-secondary mb-1">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Project Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Browse by Category</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {projectCategories.map((category, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="px-4 py-2 text-sm hover:bg-secondary hover:text-secondary-foreground cursor-pointer transition-all duration-300"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Projects from Database */}
      <ProjectsSection />

      {/* How It Works */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How ProjectHub Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Projects</h3>
              <p className="text-muted-foreground">Share your best work with detailed descriptions and live demos</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Discovered</h3>
              <p className="text-muted-foreground">Recruiters and companies browse projects to find talented developers</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-success text-success-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Land Opportunities</h3>
              <p className="text-muted-foreground">Receive job offers, freelance projects, and collaboration requests</p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-primary rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-6">Portfolio Success Stories</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">85%</div>
                <div className="text-white/80">Get Hired Within 3 Months</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">500+</div>
                <div className="text-white/80">Job Offers Made</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">₹50L+</div>
                <div className="text-white/80">Total Salary Packages</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </PageLayout>
  );
};

export default ProjectHub;