import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircleQuestion, GraduationCap, DollarSign, Clock, Star, Users, TrendingUp, BookOpen, Plus, Loader2 } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { PostQuestionDialog } from "@/components/PostQuestionDialog";
import { BecomeMentorDialog } from "@/components/BecomeMentorDialog";
import { AnswerQuestionDialog } from "@/components/AnswerQuestionDialog";

const AskTeach = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [questions, setQuestions] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [postQuestionOpen, setPostQuestionOpen] = useState(false);
  const [becomeMentorOpen, setBecomeMentorOpen] = useState(false);
  const [answerDialogOpen, setAnswerDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

  const categories = [
    "Programming", "Design", "Marketing", "Business", "Mathematics", 
    "Languages", "Science", "Finance", "Writing", "Music"
  ];

  useEffect(() => {
    fetchQuestions();
    fetchMentors();
    setupRealtimeSubscriptions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .in("status", ["open", "answered"])
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setQuestions(data || []);
    } catch (error: any) {
      console.error("Error fetching questions:", error);
      toast({
        title: "Error loading questions",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMentors = async () => {
    try {
      const { data, error } = await supabase
        .from("mentors")
        .select("*")
        .order("avg_rating", { ascending: false })
        .limit(6);

      if (error) throw error;
      setMentors(data || []);
    } catch (error: any) {
      console.error("Error fetching mentors:", error);
    }
  };

  const setupRealtimeSubscriptions = () => {
    const questionsChannel = supabase
      .channel("questions-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "questions",
        },
        (payload) => {
          console.log("New question:", payload);
          if (["open", "answered"].includes(payload.new.status)) {
            setQuestions((prev) => [payload.new, ...prev]);
            toast({
              title: "New question posted!",
              description: payload.new.question_title,
            });
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "questions",
        },
        (payload) => {
          setQuestions((prev) =>
            prev.map((q) => (q.id === payload.new.id ? payload.new : q))
          );
        }
      )
      .subscribe();

    const mentorsChannel = supabase
      .channel("mentors-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "mentors",
        },
        (payload) => {
          setMentors((prev) => [...prev, payload.new]);
          toast({
            title: "New mentor joined!",
            description: `${payload.new.name} is now available`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(questionsChannel);
      supabase.removeChannel(mentorsChannel);
    };
  };

  const handleAnswerQuestion = (question: any) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to answer questions",
        variant: "destructive",
      });
      return;
    }
    setSelectedQuestion(question);
    setAnswerDialogOpen(true);
  };


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
    <PageLayout>
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
              <Button 
                variant="hero" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => setPostQuestionOpen(true)}
              >
                <Plus className="w-5 h-5" />
                Ask Question
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => setBecomeMentorOpen(true)}
              >
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
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Recent Questions</h2>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {questions.length} Open Questions
            </Badge>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
              <p className="mt-4 text-muted-foreground">Loading questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircleQuestion className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No questions yet</h3>
              <p className="text-muted-foreground mb-4">Be the first to ask a question!</p>
              <Button onClick={() => setPostQuestionOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Post First Question
              </Button>
            </div>
          ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {questions.map((item) => (
              <Card key={item.id} className="hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1">
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
                          variant={item.status === "open" ? "outline" : "secondary"}
                          className="text-xs"
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{item.question_title}</CardTitle>
                      <p className="text-sm text-muted-foreground">by {item.asker_name}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-success">₹{item.bounty}</div>
                      <div className="text-xs text-muted-foreground">Bounty</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {item.tags?.map((tag: string, tagIndex: number) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{item.difficulty}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="hero" 
                      className="flex-1"
                      onClick={() => handleAnswerQuestion(item)}
                    >
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
          )}
        </div>
      </section>

      {/* Top Mentors */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Top Mentors</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {mentors.map((mentor) => {
              const initials = mentor.name.split(' ').map((n: string) => n[0]).join('');
              return (
              <Card key={mentor.id} className="text-center hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader>
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4">
                    {initials}
                  </div>
                  <CardTitle className="text-xl">{mentor.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {mentor.expertise}
                  </CardDescription>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="font-medium">{mentor.avg_rating || 5.0}</span>
                    <span className="text-muted-foreground">({mentor.total_students} students)</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-success">₹{mentor.hourly_rate}</div>
                      <div className="text-muted-foreground">Per Hour</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-primary">₹{mentor.total_earnings}</div>
                      <div className="text-muted-foreground">Total Earned</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold">{mentor.response_time || "< 2 hrs"}</div>
                      <div className="text-muted-foreground">Response</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold">{mentor.years_experience} yrs</div>
                      <div className="text-muted-foreground">Experience</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="hero" className="flex-1" onClick={() => setPostQuestionOpen(true)}>
                      Ask Question
                    </Button>
                    <Button variant="outline">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )})}
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

      <PostQuestionDialog 
        open={postQuestionOpen}
        onOpenChange={setPostQuestionOpen}
      />

      <BecomeMentorDialog
        open={becomeMentorOpen}
        onOpenChange={setBecomeMentorOpen}
      />

      <AnswerQuestionDialog
        question={selectedQuestion}
        open={answerDialogOpen}
        onOpenChange={setAnswerDialogOpen}
      />
    </PageLayout>
  );
};

export default AskTeach;