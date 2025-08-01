import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Quote, Star, Clock, TrendingUp, Users, DollarSign } from "lucide-react";

const SuccessStoriesSection = () => {
  const stories = [
    {
      name: "Priya from Delhi",
      achievement: "Earned ₹50,000 in 3 months through WorkZone design projects",
      avatar: "P",
      color: "bg-primary text-primary-foreground"
    },
    {
      name: "Rahul from Mumbai", 
      achievement: "Built a portfolio through ProjectHub and landed a job at a tech startup",
      avatar: "R",
      color: "bg-success text-success-foreground"
    },
    {
      name: "Sneha from Bangalore",
      achievement: "Teaching on Ask & Teach generates ₹20,000 monthly passive income",
      avatar: "S", 
      color: "bg-secondary text-secondary-foreground"
    }
  ];

  const achievements = [
    { icon: <Clock className="w-5 h-5" />, value: "24 Hours", label: "Average Time to First Earning", color: "text-primary" },
    { icon: <TrendingUp className="w-5 h-5" />, value: "95%", label: "Success Rate for Beginners", color: "text-success" },
    { icon: <DollarSign className="w-5 h-5" />, value: "₹15,000+", label: "Average Monthly Earnings", color: "text-secondary" },
    { icon: <Users className="w-5 h-5" />, value: "500+", label: "Skills Available", color: "text-primary" }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Success Stories from Our{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Community
            </span>
          </h2>
        </div>

        {/* Success Stories */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {stories.map((story, index) => (
            <Card key={index} className="relative bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-4 right-4">
                <Quote className="w-6 h-6 text-primary/30" />
              </div>
              
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${story.color} flex items-center justify-center text-xl font-bold shadow-medium`}>
                    {story.avatar}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{story.name}</CardTitle>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <CardDescription className="text-foreground leading-relaxed text-base">
                  "{story.achievement}"
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mb-16">
          <Button variant="outline" size="lg" className="text-lg px-8 py-6">
            Read More Success Stories
          </Button>
        </div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => (
            <div key={index} className="text-center p-6 bg-card rounded-xl shadow-soft hover:shadow-medium transition-all duration-300">
              <div className={`flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-3`}>
                <div className="text-white">
                  {achievement.icon}
                </div>
              </div>
              <div className={`text-2xl md:text-3xl font-bold mb-1 ${achievement.color}`}>
                {achievement.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {achievement.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;