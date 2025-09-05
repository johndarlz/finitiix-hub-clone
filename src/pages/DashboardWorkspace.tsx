import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Briefcase, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Clock, 
  DollarSign, 
  MapPin,
  Users,
  Search,
  Filter
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const DashboardWorkspace = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [postedJobs, setPostedJobs] = useState<any[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user) {
      fetchWorkspaceData();
    }
  }, [user]);

  const fetchWorkspaceData = async () => {
    try {
      setLoading(true);

      // Fetch jobs posted by user
      const { data: postedJobsData, error: postedJobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (postedJobsError) throw postedJobsError;

      // Fetch jobs applied by user
      const { data: appliedJobsData, error: appliedJobsError } = await supabase
        .from('job_applications')
        .select(`
          *,
          jobs:job_id (*)
        `)
        .eq('applicant_id', user?.id)
        .order('created_at', { ascending: false });

      if (appliedJobsError) throw appliedJobsError;

      // Fetch applications for user's posted jobs
      const jobIds = postedJobsData?.map(job => job.id) || [];
      let applicationsData: any[] = [];
      
      if (jobIds.length > 0) {
        const { data, error: applicationsError } = await supabase
          .from('job_applications')
          .select(`
            *,
            jobs:job_id (title)
          `)
          .in('job_id', jobIds)
          .order('created_at', { ascending: false });

        if (applicationsError) throw applicationsError;
        applicationsData = data || [];
      }

      setPostedJobs(postedJobsData || []);
      setAppliedJobs(appliedJobsData || []);
      setApplications(applicationsData);

    } catch (error: any) {
      console.error('Error fetching workspace data:', error);
      toast({
        title: "Error loading workspace",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (error) throw error;

      toast({
        title: "Job deleted",
        description: "The job has been deleted successfully."
      });

      fetchWorkspaceData();
    } catch (error: any) {
      toast({
        title: "Error deleting job",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeline = (timeline: string) => {
    return timeline.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading workspace...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Workspace</h1>
            <p className="text-muted-foreground">Manage your jobs and applications</p>
          </div>
          <Link to="/post-job">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Button>
          </Link>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="posted" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posted">Posted Jobs ({postedJobs.length})</TabsTrigger>
            <TabsTrigger value="applied">Applied Jobs ({appliedJobs.length})</TabsTrigger>
            <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
          </TabsList>

          {/* Posted Jobs */}
          <TabsContent value="posted" className="space-y-4">
            {postedJobs.length > 0 ? (
              <div className="grid gap-4">
                {postedJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">{job.title}</CardTitle>
                            <Badge className={getStatusColor(job.status)}>
                              {job.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              <span>₹{job.budget}</span>
                            </div>
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
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{applications.filter(app => app.job_id === job.id).length} applications</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteJob(job.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground leading-relaxed line-clamp-2 mb-4">
                        {job.description}
                      </p>
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No jobs posted yet</h3>
                  <p className="text-muted-foreground mb-4">Start by posting your first job</p>
                  <Link to="/post-job">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Post Your First Job
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Applied Jobs */}
          <TabsContent value="applied" className="space-y-4">
            {appliedJobs.length > 0 ? (
              <div className="grid gap-4">
                {appliedJobs.map((application) => (
                  <Card key={application.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">{application.jobs.title}</CardTitle>
                            <Badge className={getStatusColor(application.status)}>
                              {application.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              <span>₹{application.expected_budget}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>Applied {new Date(application.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground leading-relaxed line-clamp-2">
                        {application.why_hire_me}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No applications yet</h3>
                  <p className="text-muted-foreground mb-4">Browse jobs and start applying</p>
                  <Link to="/workzone">
                    <Button>
                      <Briefcase className="w-4 h-4 mr-2" />
                      Browse Jobs
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Applications Received */}
          <TabsContent value="applications" className="space-y-4">
            {applications.length > 0 ? (
              <div className="grid gap-4">
                {applications.map((application) => (
                  <Card key={application.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">{application.full_name}</CardTitle>
                            <Badge className={getStatusColor(application.status)}>
                              {application.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Applied for: {application.jobs?.title}</span>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              <span>₹{application.expected_budget}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(application.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button variant="hero" size="sm">
                            Accept
                          </Button>
                          <Button variant="outline" size="sm">
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium mb-1">Why hire them:</h4>
                          <p className="text-foreground leading-relaxed line-clamp-2">
                            {application.why_hire_me}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span><strong>Experience:</strong> {application.experience_level.replace('-', ' ')}</span>
                          <span><strong>Availability:</strong> {application.availability}</span>
                          <span><strong>Email:</strong> {application.email}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No applications received</h3>
                  <p className="text-muted-foreground mb-4">Post jobs to start receiving applications</p>
                  <Link to="/post-job">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Post a Job
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DashboardWorkspace;