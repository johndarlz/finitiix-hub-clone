import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Briefcase, 
  FileText, 
  Clock, 
  DollarSign, 
  Star, 
  CheckCircle,
  X,
  Eye
} from "lucide-react";
import { Link } from "react-router-dom";

interface Job {
  id: string;
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  status: string;
  created_at: string;
  job_applications: any[];
}

interface Application {
  id: string;
  proposal_message: string;
  bid_amount: number;
  status: string;
  created_at: string;
  jobs: {
    id: string;
    title: string;
    budget_min: number;
    budget_max: number;
    status: string;
  };
}

export default function Workspace() {
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchWorkspaceData();
    }
  }, [user]);

  const fetchWorkspaceData = async () => {
    try {
      // Fetch jobs posted by user
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select(`
          *,
          job_applications (*)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (jobsError) throw jobsError;

      // Fetch user's applications
      const { data: applications, error: applicationsError } = await supabase
        .from('job_applications')
        .select(`
          *,
          jobs (id, title, budget_min, budget_max, status)
        `)
        .eq('applicant_id', user?.id)
        .order('created_at', { ascending: false });

      if (applicationsError) throw applicationsError;

      setMyJobs(jobs || []);
      setMyApplications(applications || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch workspace data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Application ${status} successfully`,
      });

      fetchWorkspaceData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'hired': return 'bg-green-100 text-green-800';
      case 'open': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">Please sign in to view your workspace.</p>
          <Link to="/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Workspace</h1>
          <p className="text-muted-foreground">Manage your jobs and applications</p>
        </div>

        <Tabs defaultValue="my-jobs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-jobs">My Posted Jobs</TabsTrigger>
            <TabsTrigger value="my-applications">My Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="my-jobs">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Jobs I Posted</h2>
                <Link to="/workzone">
                  <Button>Post New Job</Button>
                </Link>
              </div>

              {loading ? (
                <div className="grid gap-4">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="animate-pulse space-y-3">
                          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-4 bg-gray-200 rounded"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : myJobs.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No jobs posted yet</h3>
                    <p className="text-muted-foreground mb-4">Start by posting your first job</p>
                    <Link to="/workzone">
                      <Button>Post a Job</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {myJobs.map((job) => (
                    <Card key={job.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                ${job.budget_min} - ${job.budget_max}
                              </div>
                              <div className="flex items-center gap-1">
                                <FileText className="h-4 w-4" />
                                {job.job_applications?.length || 0} applications
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(job.status)}>
                            {job.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {job.description}
                        </p>
                        
                        {job.job_applications && job.job_applications.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-semibold">Recent Applications</h4>
                            {job.job_applications.slice(0, 3).map((application: any) => (
                              <div key={application.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <p className="font-medium">Bid: ${application.bid_amount}</p>
                                  <p className="text-sm text-muted-foreground line-clamp-1">
                                    {application.proposal_message}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Badge className={getStatusColor(application.status)}>
                                    {application.status}
                                  </Badge>
                                  {application.status === 'pending' && (
                                    <div className="flex gap-1">
                                      <Button
                                        size="sm"
                                        onClick={() => updateApplicationStatus(application.id, 'accepted')}
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateApplicationStatus(application.id, 'rejected')}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="my-applications">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">My Applications</h2>

              {loading ? (
                <div className="grid gap-4">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="animate-pulse space-y-3">
                          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-4 bg-gray-200 rounded"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : myApplications.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
                    <p className="text-muted-foreground mb-4">Start applying to jobs that match your skills</p>
                    <Link to="/workzone">
                      <Button>Browse Jobs</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {myApplications.map((application) => (
                    <Card key={application.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl mb-2">{application.jobs.title}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                My Bid: ${application.bid_amount}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                Applied {new Date(application.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(application.status)}>
                            {application.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold mb-1">My Proposal</h4>
                            <p className="text-muted-foreground text-sm">
                              {application.proposal_message}
                            </p>
                          </div>
                          
                          <div className="flex justify-between items-center pt-3 border-t">
                            <div className="text-sm text-muted-foreground">
                              Job Budget: ${application.jobs.budget_min} - ${application.jobs.budget_max}
                            </div>
                            <Link to="/workzone">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View Job
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}