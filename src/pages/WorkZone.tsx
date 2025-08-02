import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus, Star, Clock, DollarSign, MapPin, Shield, Users, Heart, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useJobs } from "@/hooks/useJobs";
import { JobCard } from "@/components/JobCard";
import { PostJobModal } from "@/components/PostJobModal";
import { JobApplicationModal } from "@/components/JobApplicationModal";
import { useAuth } from "@/contexts/AuthContext";

export default function WorkZone() {
  const { user } = useAuth();
  const { jobs, loading, saveJob, refetch } = useJobs();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [applicationModal, setApplicationModal] = useState<{ isOpen: boolean; jobId: string | null; jobTitle: string }>({
    isOpen: false,
    jobId: null,
    jobTitle: ""
  });

  // Job categories for filtering
  const jobCategories = [
    "All Categories", "Design & Creative", "Programming & Tech", 
    "Writing & Translation", "Digital Marketing", "Video & Animation",
    "Music & Audio", "Business", "Data Entry", "Customer Service"
  ];

  const quickStats = [
    { icon: <Shield className="w-5 h-5" />, value: jobs.length.toString(), label: "Active Jobs" },
    { icon: <DollarSign className="w-5 h-5" />, value: "₹50-10K", label: "Price Range" },
    { icon: <Clock className="w-5 h-5" />, value: "24 hrs", label: "Avg Response" },
    { icon: <Users className="w-5 h-5" />, value: "98%", label: "Completion Rate" }
  ];

  const handleApplyJob = (jobId: string, jobTitle: string) => {
    if (!user) {
      alert("Please sign in to apply for jobs");
      return;
    }
    setApplicationModal({ isOpen: true, jobId, jobTitle });
  };

  const handleSaveJob = async (jobId: string) => {
    await saveJob(jobId);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || 
                           job.category.replace(/_/g, ' ').toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

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
                Post and apply to micro-jobs ranging from $50 to $10,000. Get fast results with secure payments and instant delivery.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button variant="default" size="lg" className="text-lg px-8 py-6">
                  <Shield className="w-5 h-5 mr-2" />
                  Find Jobs
                </Button>
                <PostJobModal>
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                    <Plus className="w-5 h-5 mr-2" />
                    Post a Job
                  </Button>
                </PostJobModal>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {quickStats.map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-card rounded-xl shadow-sm">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg mx-auto mb-2">
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

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Search and Post Job */}
          <div className="flex gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search jobs, skills, or keywords..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <PostJobModal>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Post a Job
              </Button>
            </PostJobModal>
          </div>

          {/* Job Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {jobCategories.map((category) => (
              <Badge 
                key={category} 
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Jobs Section */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">All Jobs</h2>
              <Button variant="outline" onClick={refetch}>Refresh Jobs</Button>
            </div>
            
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || selectedCategory !== "All Categories" 
                      ? "Try adjusting your search or filters" 
                      : "Be the first to post a job!"}
                  </p>
                  <PostJobModal>
                    <Button>Post the First Job</Button>
                  </PostJobModal>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onApply={(jobId) => handleApplyJob(jobId, job.title)}
                    onSave={handleSaveJob}
                  />
                ))}
              </div>
            )}
          </div>

          {/* How It Works */}
          <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl">
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
                  <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
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
      </div>
      
      <JobApplicationModal
        jobId={applicationModal.jobId}
        jobTitle={applicationModal.jobTitle}
        isOpen={applicationModal.isOpen}
        onClose={() => setApplicationModal({ isOpen: false, jobId: null, jobTitle: "" })}
      />
    </PageLayout>
  );
}