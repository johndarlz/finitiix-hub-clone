import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Briefcase, Search, Filter, Clock, Star, DollarSign, CheckCircle, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";
import JobDetailsDialog from "@/components/JobDetailsDialog";

const WorkZone = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all-categories");
  const [jobTypeFilter, setJobTypeFilter] = useState("all-types");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [quickStats, setQuickStats] = useState({
    totalJobs: 0,
    priceRange: "₹50-5000",
    avgResponse: "24 hrs",
    completionRate: "98%"
  });

  const jobCategories = [
    "Design & Creative", "Programming & Tech", "Writing & Translation", 
    "Digital Marketing", "Video & Animation", "Music & Audio", "Business",
    "Education & Training"
  ];

  useEffect(() => {
    fetchJobs();
    fetchQuickStats();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('jobs_changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'jobs' },
        (payload) => {
          console.log('New job added:', payload);
          fetchJobs(); // Refresh jobs list
        }
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'jobs' },
        (payload) => {
          console.log('Job updated:', payload);
          fetchJobs(); // Refresh jobs list
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchJobs = async () => {
    try {
      let query = supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,skills_required.cs.{${searchQuery}}`);
      }

      if (selectedCategory && selectedCategory !== 'all-categories') {
        query = query.eq('category', selectedCategory);
      }

      if (jobTypeFilter && jobTypeFilter !== 'all-types') {
        query = query.eq('job_type', jobTypeFilter as 'online' | 'offline');
      }

      const { data, error } = await query;

      if (error) throw error;
      setJobs(data || []);
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      toast({
        title: "Error loading jobs",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchQuickStats = async () => {
    try {
      const { count } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      setQuickStats(prev => ({
        ...prev,
        totalJobs: count || 0
      }));
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = () => {
    fetchJobs();
  };

  const handlePostJob = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post a job.",
        variant: "destructive"
      });
      navigate('/signin');
      return;
    }
    navigate('/post-job');
  };

  const handleApplyJob = (jobId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to apply for jobs.",
        variant: "destructive"
      });
      navigate('/signin');
      return;
    }
    navigate(`/apply-job/${jobId}`);
  };

  const handleViewDetails = (job: any) => {
    setSelectedJob(job);
    setIsJobDialogOpen(true);
  };

  const formatTimeline = (timeline: string) => {
    return timeline.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const quickStatsData = [
    { icon: <Briefcase className="w-5 h-5" />, value: `${quickStats.totalJobs}+`, label: "Active Jobs" },
    { icon: <DollarSign className="w-5 h-5" />, value: quickStats.priceRange, label: "Price Range" },
    { icon: <Clock className="w-5 h-5" />, value: quickStats.avgResponse, label: "Avg Response" },
    { icon: <CheckCircle className="w-5 h-5" />, value: quickStats.completionRate, label: "Completion Rate" }
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
              <Button variant="outline" size="lg" className="text-lg px-8 py-6" onClick={handlePostJob}>
                Post a Job
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {quickStatsData.map((stat, index) => (
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
              <Input
                type="text"
                placeholder="Search jobs by title, skills, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                {jobCategories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-types">All Types</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="hero" className="px-6" onClick={handleSearch}>
              Search Jobs
            </Button>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Find Jobs</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading jobs...</p>
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{job.title}</CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            {job.job_type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatTimeline(job.timeline)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">{job.category}</Badge>
                          </div>
                          {job.location_preference !== 'remote' && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{job.location_preference}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-success">₹{job.budget}</div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <CardDescription className="text-foreground leading-relaxed line-clamp-3">
                      {job.description}
                    </CardDescription>
                    
                    <div className="flex flex-wrap gap-2">
                      {job.skills_required?.slice(0, 5).map((skill: string, skillIndex: number) => (
                        <Badge key={skillIndex} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {job.skills_required?.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{job.skills_required.length - 5} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        variant="hero" 
                        className="flex-1" 
                        onClick={() => handleApplyJob(job.id)}
                      >
                        Apply Now
                      </Button>
                      <Button variant="outline" onClick={() => handleViewDetails(job)}>
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || (selectedCategory !== 'all-categories') || (jobTypeFilter !== 'all-types')
                  ? "Try adjusting your search filters" 
                  : "Be the first to post a job!"}
              </p>
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all-categories");
                setJobTypeFilter("all-types");
                fetchJobs();
              }}>
                Clear Filters
              </Button>
            </div>
          )}
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

      {/* Job Details Dialog */}
      <JobDetailsDialog 
        job={selectedJob}
        isOpen={isJobDialogOpen}
        onClose={() => setIsJobDialogOpen(false)}
      />
    </PageLayout>
  );
};

export default WorkZone;