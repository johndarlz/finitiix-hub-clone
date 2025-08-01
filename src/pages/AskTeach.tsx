import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircleQuestion, GraduationCap, DollarSign, Clock, Star, Users, TrendingUp, BookOpen } from "lucide-react";

const AskTeach = () => {
  const categories = [
    "Programming", "Design", "Marketing", "Business", "Mathematics", 
    "Languages", "Science", "Finance", "Writing", "Music"
  ];

  const activeQuestions = [
    {
      question: "How to implement JWT authentication in Node.js?",
      asker: "Priya Sharma",
      category: "Programming",
      bounty: "₹150",
      timePosted: "2 hours ago",
      responses: 3,
      urgency: "High",
      difficulty: "Intermediate",
      tags: ["Node.js", "JWT", "Authentication"],
      status: "Open"
    },
    {
      question: "Best practices for UI/UX design in mobile apps?",
      asker: "Rahul Verma",
      category: "Design",
      bounty: "₹200",
      timePosted: "4 hours ago",
      responses: 7,
      urgency: "Medium",
      difficulty: "Beginner",
      tags: ["UI/UX", "Mobile Design", "Best Practices"],
      status: "Open"
    },
    {
      question: "How to calculate compound interest for investments?",
      asker: "Sneha Patel",
      category: "Finance",
      bounty: "₹80",
      timePosted: "1 hour ago",
      responses: 2,
      urgency: "Low",
      difficulty: "Beginner",
      tags: ["Finance", "Investment", "Mathematics"],
      status: "Open"
    },
    {
      question: "Digital marketing strategy for startup launch?",
      asker: "Arjun Kumar",
      category: "Marketing",
      bounty: "₹300",
      timePosted: "6 hours ago",
      responses: 12,
      urgency: "High",
      difficulty: "Advanced",
      tags: ["Digital Marketing", "Startup", "Strategy"],
      status: "Answered"
    },
    {
      question: "Python data visualization with matplotlib tips?",
      asker: "Meera Singh",
      category: "Programming",
      bounty: "₹120",
      timePosted: "3 hours ago",
      responses: 5,
      urgency: "Medium",
      difficulty: "Intermediate",
      tags: ["Python", "Data Visualization", "Matplotlib"],
      status: "Open"
    },
    {
      question: "How to write compelling copy for landing pages?",
      asker: "Kiran Gupta",
      category: "Writing",
      bounty: "₹180",
      timePosted: "5 hours ago",
      responses: 8,
      urgency: "Medium",
      difficulty: "Intermediate",
      tags: ["Copywriting", "Landing Pages", "Conversion"],
      status: "Open"
    }
  ];

  const mentorProfiles = [
    {
      name: "Dr. Rajesh Kumar",
      expertise: "Data Science & Machine Learning",
      rating: 4.9,
      students: 245,
      hourlyRate: "₹500",
      totalEarnings: "₹45,000",
      yearsExperience: 8,
      responseTime: "< 2 hours",
      successRate: "98%",
      image: "👨‍💻"
    },
    {
      name: "Priya Sharma",
      expertise: "UI/UX Design & Product",
      rating: 4.8,
      students: 189,
      hourlyRate: "₹400",
      totalEarnings: "₹32,000",
      yearsExperience: 5,
      responseTime: "< 1 hour",
      successRate: "96%",
      image: "👩‍🎨"
    },
    {
      name: "Amit Verma",
      expertise: "Full Stack Development",
      rating: 4.9,
      students: 312,
      hourlyRate: "₹600",
      totalEarnings: "₹58,000",
      yearsExperience: 7,
      responseTime: "< 3 hours",
      successRate: "97%",
      image: "👨‍💼"
    }
  ];

  const quickStats = [
    { icon: <MessageCircleQuestion className="w-5 h-5" />, value: "15K+", label: "Questions Solved" },
    { icon: <GraduationCap className="w-5 h-5" />, value: "1,200+", label: "Expert Mentors" },
    { icon: <DollarSign className="w-5 h-5" />, value: "₹25L+", label: "Paid to Experts" },
    { icon: <Users className="w-5 h-5" />, value: "95%", label: "Satisfaction Rate" }
  ];

  const howItWorks = [
    {
      icon: <MessageCircleQuestion className="w-6 h-6" />,
      title: "Ask Your Question",
      description: "Post your doubt with details and set a bounty amount for quick responses"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Get Expert Answers",
      description: "Qualified mentors provide detailed solutions and explanations"
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Pay for Value",
      description: "Only pay when you're satisfied with the answer quality"
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Learn & Grow",
      description: "Build knowledge and connect with mentors for ongoing learning"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-success/10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Ask & Teach
              </span>{" "}
              Learn & Mentor
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Post doubts and get them solved for small amounts. Skilled users can teach, mentor, and earn money.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                <MessageCircleQuestion className="w-5 h-5" />
                Ask Question
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                <GraduationCap className="w-5 h-5" />
                Become Mentor
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
                  <div className="text-xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Popular Categories</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground cursor-pointer transition-all duration-300"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Active Questions */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Recent Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {activeQuestions.map((item, index) => (
              <Card key={index} className="hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                        <Badge 
                          variant={item.urgency === "High" ? "destructive" : item.urgency === "Medium" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {item.urgency}
                        </Badge>
                        <Badge 
                          variant={item.status === "Open" ? "outline" : "secondary"}
                          className="text-xs"
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{item.question}</CardTitle>
                      <p className="text-sm text-muted-foreground">by {item.asker}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-success">{item.bounty}</div>
                      <div className="text-xs text-muted-foreground">Bounty</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{item.timePosted}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircleQuestion className="w-4 h-4" />
                      <span>{item.responses} responses</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{item.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>Study Help</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="hero" className="flex-1">
                      Answer Question
                    </Button>
                    <Button variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              View All Questions
            </Button>
          </div>
        </div>
      </section>

      {/* Top Mentors */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Top Mentors</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {mentorProfiles.map((mentor, index) => (
              <Card key={index} className="text-center hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader>
                  <div className="text-6xl mb-4">{mentor.image}</div>
                  <CardTitle className="text-xl">{mentor.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {mentor.expertise}
                  </CardDescription>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="font-medium">{mentor.rating}</span>
                    <span className="text-muted-foreground">({mentor.students} students)</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-success">{mentor.hourlyRate}</div>
                      <div className="text-muted-foreground">Per Hour</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-primary">{mentor.totalEarnings}</div>
                      <div className="text-muted-foreground">Total Earned</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold">{mentor.responseTime}</div>
                      <div className="text-muted-foreground">Response</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold">{mentor.successRate}</div>
                      <div className="text-muted-foreground">Success Rate</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="hero" className="flex-1">
                      Ask Question
                    </Button>
                    <Button variant="outline">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How Ask & Teach Works</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center relative">
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent z-0" 
                       style={{ width: 'calc(100% - 2rem)' }} />
                )}
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 shadow-medium">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Earning Potential */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-primary rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-6">Mentor Earning Potential</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">₹200-1000</div>
                <div className="text-white/80">Per Hour Range</div>
                <p className="text-sm text-white/60 mt-2">Based on expertise level</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">₹20,000+</div>
                <div className="text-white/80">Monthly Potential</div>
                <p className="text-sm text-white/60 mt-2">For active mentors</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="text-white/80">Flexible Schedule</div>
                <p className="text-sm text-white/60 mt-2">Work anytime, anywhere</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AskTeach;