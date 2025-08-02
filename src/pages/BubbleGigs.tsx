import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, Play, Clock, Star, Eye, MessageCircle, TrendingUp, Users, DollarSign } from "lucide-react";
import PageLayout from "@/components/PageLayout";

const BubbleGigs = () => {
  const gigCategories = [
    "Design & Creative", "Programming & Tech", "Video Editing", "Content Creation",
    "Digital Marketing", "Business Consulting", "Music & Audio", "Writing"
  ];

  const featuredGigs = [
    {
      title: "Professional Logo Design in 24hrs",
      creator: "Priya Sharma",
      description: "I'll create a stunning, modern logo for your brand with unlimited revisions until you're 100% satisfied.",
      price: "₹2,500",
      duration: "1 day",
      rating: 4.9,
      reviews: 127,
      views: 2400,
      image: "🎨",
      tags: ["Logo Design", "Branding", "Adobe Illustrator"],
      isTopRated: true,
      responseTime: "2 hrs"
    },
    {
      title: "Instagram Reel Editing Magic",
      creator: "Rahul Verma", 
      description: "Transform your raw footage into viral-ready Instagram reels with trending effects and music.",
      price: "₹800",
      duration: "2 days",
      rating: 4.8,
      reviews: 89,
      views: 1850,
      image: "📱",
      tags: ["Video Editing", "Instagram", "Social Media"],
      isTopRated: false,
      responseTime: "4 hrs"
    },
    {
      title: "Python Script for Data Automation",
      creator: "Sneha Patel",
      description: "I'll write custom Python scripts to automate your data processing and save you hours of manual work.",
      price: "₹1,500",
      duration: "3 days",
      rating: 5.0,
      reviews: 64,
      views: 1200,
      image: "🐍",
      tags: ["Python", "Automation", "Data Processing"],
      isTopRated: true,
      responseTime: "1 hr"
    },
    {
      title: "Professional Voice Over Recording",
      creator: "Arjun Kumar",
      description: "High-quality voice over for your videos, ads, or presentations with professional studio recording.",
      price: "₹1,200",
      duration: "1 day",
      rating: 4.7,
      reviews: 156,
      views: 3100,
      image: "🎙️",
      tags: ["Voice Over", "Audio", "Recording"],
      isTopRated: false,
      responseTime: "3 hrs"
    },
    {
      title: "SEO Content Writing Package",
      creator: "Meera Singh",
      description: "SEO-optimized blog posts and web content that ranks on Google and converts visitors to customers.",
      price: "₹900",
      duration: "2 days",
      rating: 4.9,
      reviews: 98,
      views: 1680,
      image: "✍️",
      tags: ["Content Writing", "SEO", "Copywriting"],
      isTopRated: true,
      responseTime: "6 hrs"
    },
    {
      title: "Website Speed Optimization",
      creator: "Kiran Gupta",
      description: "I'll optimize your website to load 3x faster, improving user experience and search rankings.",
      price: "₹2,000",
      duration: "2 days",
      rating: 4.8,
      reviews: 73,
      views: 950,
      image: "⚡",
      tags: ["Web Development", "Performance", "SEO"],
      isTopRated: false,
      responseTime: "5 hrs"
    }
  ];

  const quickStats = [
    { icon: <Video className="w-5 h-5" />, value: "10K+", label: "Active Gigs" },
    { icon: <Users className="w-5 h-5" />, value: "5K+", label: "Creators" },
    { icon: <DollarSign className="w-5 h-5" />, value: "₹50L+", label: "Earned" },
    { icon: <TrendingUp className="w-5 h-5" />, value: "90%", label: "Satisfaction" }
  ];

  const howItWorks = [
    {
      icon: <Video className="w-6 h-6" />,
      title: "Create Your Pitch",
      description: "Record a 1-minute video showcasing your service with enthusiasm and clarity"
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Get Discovered",
      description: "Buyers scroll through gigs like social media and discover your unique services"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Instant Booking",
      description: "Interested buyers can book your service instantly with one click"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Deliver & Earn",
      description: "Complete the work, get great reviews, and build your reputation"
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
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                BubbleGigs
              </span>{" "}
              1-Minute Video Gigs
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create 1-minute video pitches for your services. Buyers can scroll, discover, and hire you instantly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                <Video className="w-5 h-5" />
                Create Your Gig
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                <Play className="w-5 h-5" />
                Browse Gigs
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

      {/* Gig Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Popular Categories</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {gigCategories.map((category, index) => (
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

      {/* Featured Gigs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Trending BubbleGigs</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredGigs.map((gig, index) => (
              <Card key={index} className="group hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{gig.image}</div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-2xl font-bold text-success">{gig.price}</div>
                      {gig.isTopRated && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="w-3 h-3 mr-1 fill-primary text-primary" />
                          Top Rated
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                    {gig.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">by {gig.creator}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <CardDescription className="text-foreground leading-relaxed line-clamp-3">
                    {gig.description}
                  </CardDescription>
                  
                  <div className="flex flex-wrap gap-2">
                    {gig.tags.slice(0, 3).map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{gig.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span>{gig.rating} ({gig.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{gig.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{gig.responseTime}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="hero" className="flex-1">
                      <Play className="w-4 h-4" />
                      Watch Pitch
                    </Button>
                    <Button variant="outline">
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Gigs
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">How BubbleGigs Works</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            The viral way to sell your services with 1-minute video pitches
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center relative">
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent z-0" 
                       style={{ width: 'calc(100% - 2rem)' }} />
                )}
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-medium">
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

      {/* Success Stories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-primary rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-6">Creator Success Stories</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">3x</div>
                <div className="text-white/80">Higher Conversion Rate</div>
                <p className="text-sm text-white/60 mt-2">vs. traditional text-based services</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">₹25K+</div>
                <div className="text-white/80">Average Monthly Earnings</div>
                <p className="text-sm text-white/60 mt-2">for active creators</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">72%</div>
                <div className="text-white/80">Repeat Customers</div>
                <p className="text-sm text-white/60 mt-2">build long-term relationships</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </PageLayout>
  );
};

export default BubbleGigs;