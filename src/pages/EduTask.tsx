import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, BookOpen, Trophy, Clock, Star, Play, CheckCircle, Users } from "lucide-react";
import PageLayout from "@/components/PageLayout";

const EduTask = () => {
  const skillPaths = [
    "Web Development", "Digital Marketing", "Graphic Design", "Data Analysis", 
    "Content Writing", "Video Editing", "Photography", "Business Analytics"
  ];

  const featuredCourses = [
    {
      title: "React Frontend Development",
      description: "Master React.js with hands-on projects. Build 3 real-world applications and earn while learning.",
      instructor: "Priya Sharma",
      rating: 4.9,
      students: 1240,
      duration: "6 weeks",
      earning: "₹5,000",
      level: "Intermediate",
      image: "🚀",
      progress: 0,
      skills: ["React", "JavaScript", "CSS"],
      projects: 3
    },
    {
      title: "Digital Marketing Fundamentals", 
      description: "Learn SEO, social media marketing, and Google Ads. Complete real client projects for certification.",
      instructor: "Rahul Verma",
      rating: 4.8,
      students: 890,
      duration: "4 weeks",
      earning: "₹3,500",
      level: "Beginner",
      image: "📱",
      progress: 0,
      skills: ["SEO", "Social Media", "Google Ads"],
      projects: 2
    },
    {
      title: "UI/UX Design Mastery",
      description: "Create stunning user interfaces and experiences. Work on live projects with design agencies.",
      instructor: "Sneha Patel",
      rating: 4.9,
      students: 650,
      duration: "8 weeks", 
      earning: "₹7,200",
      level: "Advanced",
      image: "🎨",
      progress: 0,
      skills: ["Figma", "Prototyping", "User Research"],
      projects: 4
    },
    {
      title: "Python Data Analysis",
      description: "Analyze data with Python, pandas, and visualization tools. Complete industry-standard projects.",
      instructor: "Arjun Kumar",
      rating: 4.7,
      students: 1100,
      duration: "5 weeks",
      earning: "₹4,500",
      level: "Intermediate",
      image: "📊",
      progress: 0,
      skills: ["Python", "Pandas", "Matplotlib"],
      projects: 3
    }
  ];

  const quickStats = [
    { icon: <BookOpen className="w-5 h-5" />, value: "200+", label: "Active Courses" },
    { icon: <Users className="w-5 h-5" />, value: "50K+", label: "Students" },
    { icon: <Trophy className="w-5 h-5" />, value: "95%", label: "Success Rate" },
    { icon: <CheckCircle className="w-5 h-5" />, value: "₹15K", label: "Avg. Earnings" }
  ];

  const learningProcess = [
    {
      icon: <Play className="w-6 h-6" />,
      title: "Watch & Learn",
      description: "High-quality video lessons with practical examples"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Complete Quizzes",
      description: "Test your knowledge and earn points for correct answers"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Build Projects",
      description: "Apply skills in real-world projects and build portfolio"
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Get Certified",
      description: "Receive industry-recognized certificates and start earning"
    }
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-success/10 via-background to-primary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                EduTask
              </span>{" "}
              Learn & Earn
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Take mini skill courses, pass quizzes, and unlock real-world projects. Build your CV while earning money.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                <GraduationCap className="w-5 h-5" />
                Start Learning
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Browse Courses
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
                  <div className="text-xl font-bold text-success mb-1">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skill Paths */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Choose Your Learning Path</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {skillPaths.map((path, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="px-4 py-2 text-sm hover:bg-success hover:text-success-foreground cursor-pointer transition-all duration-300"
              >
                {path}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Courses</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {featuredCourses.map((course, index) => (
              <Card key={index} className="hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{course.image}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {course.level}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">by {course.instructor}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-primary text-primary" />
                          <span>{course.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{course.students.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-success">{course.earning}</div>
                      <div className="text-xs text-muted-foreground">Potential Earnings</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <CardDescription className="text-foreground leading-relaxed">
                    {course.description}
                  </CardDescription>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {course.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{course.projects} Projects</span>
                    <span>Certificate Included</span>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="hero" className="flex-1">
                      Start Course
                    </Button>
                    <Button variant="outline">
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              View All Courses
            </Button>
          </div>
        </div>
      </section>

      {/* Learning Process */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How EduTask Works</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {learningProcess.map((step, index) => (
              <div key={index} className="text-center relative">
                {index < learningProcess.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-success/30 to-transparent z-0" 
                       style={{ width: 'calc(100% - 2rem)' }} />
                )}
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-success text-success-foreground rounded-full flex items-center justify-center mx-auto mb-4 shadow-medium">
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

      {/* Success Metrics */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-primary rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-6">Join Thousands of Successful Learners</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl font-bold mb-2">50,000+</div>
                <div className="text-white/80">Students Enrolled</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">95%</div>
                <div className="text-white/80">Course Completion</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">₹15,000</div>
                <div className="text-white/80">Average Monthly Earning</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">200+</div>
                <div className="text-white/80">Industry Partners</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </PageLayout>
  );
};

export default EduTask;