import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Search, Filter, Clock, Star, DollarSign, CheckCircle } from "lucide-react";
import PageLayout from "@/components/PageLayout";

const WorkZone = () => {
  const jobCategories = [
    "Design & Creative", "Programming & Tech", "Writing & Translation", 
    "Digital Marketing", "Video & Animation", "Music & Audio", "Business"
  ];

  const featuredJobs = [
    {
      title: "Logo Design for Startup",
      description: "Create a modern, minimalist logo for a tech startup. Requirements include vector files and multiple format deliverables.",
      price: "₹2,500",
      duration: "3 days",
      skills: ["Logo Design", "Adobe Illustrator", "Branding"],
      rating: 4.9,
      proposals: 12,
      verified: true
    },
    {
      title: "WordPress Website Bug Fix",
      description: "Fix responsive issues and optimize loading speed for WordPress e-commerce site. Quick turnaround needed.",
      price: "₹1,800",
      duration: "2 days", 
      skills: ["WordPress", "PHP", "CSS"],
      rating: 4.8,
      proposals: 8,
      verified: true
    },
    {
      title: "Social Media Content Creation",
      description: "Create 10 Instagram posts with engaging captions for a fitness brand. Include hashtag research.",
      price: "₹1,200",
      duration: "5 days",
      skills: ["Content Writing", "Social Media", "Canva"],
      rating: 4.7,
      proposals: 15,
      verified: false
    },
    {
      title: "Data Entry & Excel Analysis",
      description: "Process customer data and create analytical reports with charts and insights. Accuracy is crucial.",
      price: "₹800",
      duration: "1 day",
      skills: ["Excel", "Data Analysis", "Data Entry"],
      rating: 4.6,
      proposals: 25,
      verified: true
    }
  ];

  const quickStats = [
    { icon: <Briefcase className="w-5 h-5" />, value: "2,500+", label: "Active Jobs" },
    { icon: <DollarSign className="w-5 h-5" />, value: "₹50-5000", label: "Price Range" },
    { icon: <Clock className="w-5 h-5" />, value: "24 hrs", label: "Avg Response" },
    { icon: <CheckCircle className="w-5 h-5" />, value: "98%", label: "Completion Rate" }
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                WorkZone
              </span>{" "}
              Micro Freelance Jobs
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Post and apply to micro-jobs ranging from ₹50 to ₹5000. Get fast results with secure payments and instant delivery.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                <Briefcase className="w-5 h-5" />
                Find Jobs
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Post a Job
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

      {/* Job Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Browse by Category</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {jobCategories.map((category, index) => (
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

      {/* Search & Filter Section */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs by title, skills, or description..."
                className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button variant="outline" className="px-6">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            <Button variant="hero" className="px-6">
              Search Jobs
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Jobs</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {featuredJobs.map((job, index) => (
              <Card key={index} className="hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        {job.verified && (
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-primary text-primary" />
                          <span>{job.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{job.duration}</span>
                        </div>
                        <div>{job.proposals} proposals</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-success">{job.price}</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <CardDescription className="text-foreground leading-relaxed">
                    {job.description}
                  </CardDescription>
                  
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="hero" className="flex-1">
                      Apply Now
                    </Button>
                    <Button variant="outline">
                      Save Job
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Jobs
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How WorkZone Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse & Apply</h3>
              <p className="text-muted-foreground">Find jobs that match your skills and submit compelling proposals</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-success text-success-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Complete Work</h3>
              <p className="text-muted-foreground">Deliver high-quality work within the agreed timeline</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Paid</h3>
              <p className="text-muted-foreground">Receive secure payments directly to your account</p>
            </div>
          </div>
        </div>
      </section>
      </div>
    </PageLayout>
  );
};

export default WorkZone;