import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, Coins, Handshake, Star, TrendingUp, Users, Clock, CheckCircle, Plus, Loader2 } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CreateSkillExchangeDialog } from "@/components/CreateSkillExchangeDialog";
import { ProposeExchangeDialog } from "@/components/ProposeExchangeDialog";
import { useAuth } from "@/contexts/AuthContext";

const SkillExchange = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [exchanges, setExchanges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [proposeDialogOpen, setProposeDialogOpen] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState<any>(null);

  const skillCategories = [
    "Design ↔ Development", "Writing ↔ Marketing", "Music ↔ Video", "Teaching ↔ Learning",
    "Business ↔ Tech", "Language ↔ Culture", "Fitness ↔ Nutrition", "Art ↔ Photography"
  ];

  useEffect(() => {
    fetchExchanges();
    setupRealtimeSubscription();
  }, []);

  const fetchExchanges = async () => {
    try {
      const { data, error } = await supabase
        .from("skill_exchanges")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setExchanges(data || []);
    } catch (error: any) {
      console.error("Error fetching exchanges:", error);
      toast({
        title: "Error loading exchanges",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel("skill-exchanges-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "skill_exchanges",
        },
        (payload) => {
          console.log("New exchange added:", payload);
          if (payload.new.status === "active") {
            setExchanges((prev) => [payload.new, ...prev]);
            toast({
              title: "New skill exchange available!",
              description: `${payload.new.offering_skill} ↔ ${payload.new.wanting_skill}`,
            });
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "skill_exchanges",
        },
        (payload) => {
          console.log("Exchange updated:", payload);
          setExchanges((prev) =>
            prev.map((ex) => (ex.id === payload.new.id ? payload.new : ex))
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "skill_exchanges",
        },
        (payload) => {
          console.log("Exchange deleted:", payload);
          setExchanges((prev) => prev.filter((ex) => ex.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleProposeExchange = (exchange: any) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to propose an exchange",
        variant: "destructive",
      });
      return;
    }
    setSelectedExchange(exchange);
    setProposeDialogOpen(true);
  };

  const quickStats = [
    { icon: <ArrowRightLeft className="w-5 h-5" />, value: "3,000+", label: "Active Exchanges" },
    { icon: <Users className="w-5 h-5" />, value: "8K+", label: "Members" },
    { icon: <Coins className="w-5 h-5" />, value: "50K+", label: "Coins Circulated" },
    { icon: <Handshake className="w-5 h-5" />, value: "95%", label: "Success Rate" }
  ];

  const howItWorks = [
    {
      icon: <ArrowRightLeft className="w-6 h-6" />,
      title: "Post Your Exchange",
      description: "Create an offer: 'I do [your skill], want [skill you need]' with clear requirements"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Find Matches",
      description: "Browse offers or get matched with people who have complementary skill needs"
    },
    {
      icon: <Handshake className="w-6 h-6" />,
      title: "Agree & Exchange",
      description: "Discuss details, set milestones, and start working on each other's projects"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Review & Earn Coins",
      description: "Complete the exchange, leave reviews, and earn virtual coins for future trades"
    }
  ];

  const coinPackages = [
    { coins: 50, price: "₹500", bonus: "0", popular: false },
    { coins: 100, price: "₹900", bonus: "10", popular: true },
    { coins: 250, price: "₹2000", bonus: "50", popular: false },
    { coins: 500, price: "₹3500", bonus: "150", popular: false }
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
                SkillExchange
              </span>{" "}
              Barter Your Skills
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Exchange skills without cash or use virtual coins. Post 'I do this, want that' gigs for flexible collaboration.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                variant="hero" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => setCreateDialogOpen(true)}
              >
                <Plus className="w-5 h-5" />
                Post Exchange
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                <Coins className="w-5 h-5" />
                Buy Coins
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

      {/* Exchange Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Popular Exchange Categories</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {skillCategories.map((category, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="px-4 py-2 text-sm hover:bg-success hover:text-success-foreground cursor-pointer transition-all duration-300"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Exchange Offers */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Active Exchange Offers</h2>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {exchanges.length} Live Exchanges
            </Badge>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
              <p className="mt-4 text-muted-foreground">Loading exchanges...</p>
            </div>
          ) : exchanges.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRightLeft className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No exchanges available yet</h3>
              <p className="text-muted-foreground mb-4">Be the first to post a skill exchange!</p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Exchange
              </Button>
            </div>
          ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exchanges.map((offer) => (
              <Card key={offer.id} className="group hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant={offer.exchange_type === "Premium Exchange" ? "secondary" : offer.exchange_type === "Quick Exchange" ? "default" : "outline"} 
                          className="text-xs"
                        >
                          {offer.exchange_type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {offer.experience_level || "Intermediate"}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {offer.offering_skill} ↔ {offer.wanting_skill}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">by {offer.offerer_name}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-primary font-semibold">
                        <Coins className="w-4 h-4" />
                        <span>{offer.coins}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <CardDescription className="text-foreground leading-relaxed line-clamp-3">
                    {offer.description}
                  </CardDescription>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{offer.timeframe}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{offer.category.split(' ↔ ')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Handshake className="w-4 h-4" />
                      <span>{offer.location_preference || "Remote"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span>{offer.status}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="hero" 
                      className="flex-1"
                      onClick={() => handleProposeExchange(offer)}
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                      Propose Exchange
                    </Button>
                    <Button variant="outline">
                      <Coins className="w-4 h-4" />
                      Use Coins
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Virtual Coins Section */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Virtual Coins for Flexible Exchanges</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Can't find a direct skill match? Use virtual coins to trade with anyone in the community
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {coinPackages.map((pkg, index) => (
              <Card key={index} className={`text-center hover:shadow-medium transition-all duration-300 ${pkg.popular ? 'ring-2 ring-primary shadow-strong' : ''}`}>
                {pkg.popular && (
                  <div className="bg-primary text-primary-foreground text-xs font-medium py-1 px-3 rounded-b-lg mx-auto w-fit mb-4">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <div className="text-4xl mb-2">🪙</div>
                  <CardTitle className="text-2xl">{pkg.coins} Coins</CardTitle>
                  {pkg.bonus !== "0" && (
                    <Badge variant="secondary" className="mx-auto">
                      +{pkg.bonus} Bonus
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-4">{pkg.price}</div>
                  <Button variant={pkg.popular ? "hero" : "outline"} className="w-full">
                    Buy Coins
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How SkillExchange Works</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center relative">
                {index < howItWorks.length - 1 && (
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

      {/* Success Stories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-primary rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-6">Community Success</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">₹0</div>
                <div className="text-white/80">Cost to Start</div>
                <p className="text-sm text-white/60 mt-2">No upfront investment needed</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">2X</div>
                <div className="text-white/80">Skill Development</div>
                <p className="text-sm text-white/60 mt-2">Learn while you earn</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">500+</div>
                <div className="text-white/80">Skills Available</div>
                <p className="text-sm text-white/60 mt-2">From tech to creative arts</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>

      <CreateSkillExchangeDialog 
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <ProposeExchangeDialog
        exchange={selectedExchange}
        open={proposeDialogOpen}
        onOpenChange={setProposeDialogOpen}
      />
    </PageLayout>
  );
};

export default SkillExchange;