import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Briefcase, 
  FolderOpen, 
  Zap, 
  MessageCircle, 
  DollarSign,
  TrendingUp,
  Users,
  Activity,
  Eye,
  Check,
  X,
  Trash2,
  BarChart3,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalJobsPosted: 0,
    totalProjectsUploaded: 0,
    totalGigs: 0,
    totalQAPosts: 0,
    totalSkillExchanges: 0,
    totalEarnings: 0,
    pendingApprovals: 0
  });
  
  // Detailed data states
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobApplications, setJobApplications] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [gigs, setGigs] = useState<any[]>([]);
  const [gigBookings, setGigBookings] = useState<any[]>([]);
  const [skillExchanges, setSkillExchanges] = useState<any[]>([]);
  const [exchangeProposals, setExchangeProposals] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  // Real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const channels = [
      supabase.channel('job_applications_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'job_applications' }, () => {
          fetchJobApplications();
        })
        .subscribe(),
      
      supabase.channel('gig_bookings_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'gig_bookings' }, () => {
          fetchGigBookings();
        })
        .subscribe(),
      
      supabase.channel('exchange_proposals_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'skill_exchange_proposals' }, () => {
          fetchExchangeProposals();
        })
        .subscribe(),
    ];

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [user]);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchJobs(),
      fetchJobApplications(),
      fetchProjects(),
      fetchGigs(),
      fetchGigBookings(),
      fetchSkillExchanges(),
      fetchExchangeProposals(),
      fetchQuestions(),
      fetchAnswers()
    ]);
    calculateStats();
    setLoading(false);
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
    toast({ title: "Data refreshed successfully" });
  };

  const fetchJobs = async () => {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });
    setJobs(data || []);
  };

  const fetchJobApplications = async () => {
    const { data } = await supabase
      .from('job_applications')
      .select(`
        *,
        jobs:job_id (title, category)
      `)
      .in('job_id', jobs.map(j => j.id) || [])
      .order('created_at', { ascending: false });
    setJobApplications(data || []);
  };

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });
    setProjects(data || []);
  };

  const fetchGigs = async () => {
    const { data } = await supabase
      .from('gigs')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });
    setGigs(data || []);
  };

  const fetchGigBookings = async () => {
    const { data } = await supabase
      .from('gig_bookings')
      .select(`
        *,
        gigs:gig_id (title, category)
      `)
      .in('gig_id', gigs.map(g => g.id) || [])
      .order('created_at', { ascending: false });
    setGigBookings(data || []);
  };

  const fetchSkillExchanges = async () => {
    const { data } = await supabase
      .from('skill_exchanges')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });
    setSkillExchanges(data || []);
  };

  const fetchExchangeProposals = async () => {
    const { data } = await supabase
      .from('skill_exchange_proposals')
      .select(`
        *,
        skill_exchanges:exchange_id (offering_skill, wanting_skill)
      `)
      .in('exchange_id', skillExchanges.map(e => e.id) || [])
      .order('created_at', { ascending: false });
    setExchangeProposals(data || []);
  };

  const fetchQuestions = async () => {
    const { data } = await supabase
      .from('questions')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });
    setQuestions(data || []);
  };

  const fetchAnswers = async () => {
    const { data } = await supabase
      .from('answers')
      .select(`
        *,
        questions:question_id (question_title)
      `)
      .in('question_id', questions.map(q => q.id) || [])
      .order('created_at', { ascending: false });
    setAnswers(data || []);
  };

  const calculateStats = () => {
    const pendingApplications = jobApplications.filter(a => a.status === 'pending').length;
    const pendingBookings = gigBookings.filter(b => b.status === 'pending').length;
    const pendingProposals = exchangeProposals.filter(p => p.status === 'pending').length;

    setStats({
      totalJobsPosted: jobs.length,
      totalProjectsUploaded: projects.length,
      totalGigs: gigs.length,
      totalQAPosts: questions.length,
      totalSkillExchanges: skillExchanges.length,
      totalEarnings: (jobApplications.filter(a => a.status === 'accepted').length * 1500) +
                     (gigBookings.filter(b => b.status === 'completed').length * 2000),
      pendingApprovals: pendingApplications + pendingBookings + pendingProposals
    });
  };

  // Approval handlers
  const handleApproveApplication = async (applicationId: string) => {
    const { error } = await supabase
      .from('job_applications')
      .update({ status: 'accepted' })
      .eq('id', applicationId);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Application approved" });
      fetchJobApplications();
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    const { error } = await supabase
      .from('job_applications')
      .update({ status: 'rejected' })
      .eq('id', applicationId);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Application rejected" });
      fetchJobApplications();
    }
  };

  const handleApproveBooking = async (bookingId: string) => {
    const { error } = await supabase
      .from('gig_bookings')
      .update({ status: 'confirmed' })
      .eq('id', bookingId);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Booking approved" });
      fetchGigBookings();
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    const { error } = await supabase
      .from('gig_bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Booking rejected" });
      fetchGigBookings();
    }
  };

  const handleApproveProposal = async (proposalId: string) => {
    const { error } = await supabase
      .from('skill_exchange_proposals')
      .update({ status: 'accepted' })
      .eq('id', proposalId);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Proposal approved" });
      fetchExchangeProposals();
    }
  };

  const handleRejectProposal = async (proposalId: string) => {
    const { error } = await supabase
      .from('skill_exchange_proposals')
      .update({ status: 'rejected' })
      .eq('id', proposalId);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Proposal rejected" });
      fetchExchangeProposals();
    }
  };

  // Delete handlers
  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Job deleted successfully" });
      fetchJobs();
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Project deleted successfully" });
      fetchProjects();
    }
  };

  const handleDeleteGig = async (gigId: string) => {
    if (!confirm('Are you sure you want to delete this gig?')) return;
    
    const { error } = await supabase
      .from('gigs')
      .delete()
      .eq('id', gigId);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Gig deleted successfully" });
      fetchGigs();
    }
  };

  const handleDeleteExchange = async (exchangeId: string) => {
    if (!confirm('Are you sure you want to delete this skill exchange?')) return;
    
    const { error } = await supabase
      .from('skill_exchanges')
      .delete()
      .eq('id', exchangeId);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Skill exchange deleted successfully" });
      fetchSkillExchanges();
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', questionId);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Question deleted successfully" });
      fetchQuestions();
    }
  };

  const statCards = [
    {
      title: "Jobs Posted",
      value: stats.totalJobsPosted,
      icon: Briefcase,
      color: "text-blue-600",
      description: "WorkZone"
    },
    {
      title: "Projects",
      value: stats.totalProjectsUploaded,
      icon: FolderOpen,
      color: "text-purple-600",
      description: "ProjectHub"
    },
    {
      title: "Gigs",
      value: stats.totalGigs,
      icon: Zap,
      color: "text-orange-600",
      description: "BubbleGigs"
    },
    {
      title: "Skill Exchanges",
      value: stats.totalSkillExchanges,
      icon: RefreshCw,
      color: "text-green-600",
      description: "Active exchanges"
    },
    {
      title: "Q&A Posts",
      value: stats.totalQAPosts,
      icon: MessageCircle,
      color: "text-indigo-600",
      description: "Ask & Teach"
    },
    {
      title: "Pending Approvals",
      value: stats.pendingApprovals,
      icon: Activity,
      color: "text-red-600",
      description: "Requires action"
    }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Advanced Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage all your activities and approvals
            </p>
          </div>
          <Button onClick={refreshData} disabled={refreshing} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <Badge variant="secondary">{stat.value}</Badge>
                </div>
                <h3 className="font-semibold text-sm">{stat.title}</h3>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Management Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="gigs">Gigs</TabsTrigger>
            <TabsTrigger value="exchanges">Exchanges</TabsTrigger>
            <TabsTrigger value="questions">Q&A</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Activity Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Content Created</h4>
                    <div className="text-sm text-muted-foreground">
                      <p>Jobs: {jobs.length}</p>
                      <p>Projects: {projects.length}</p>
                      <p>Gigs: {gigs.length}</p>
                      <p>Skill Exchanges: {skillExchanges.length}</p>
                      <p>Questions: {questions.length}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Requests Received</h4>
                    <div className="text-sm text-muted-foreground">
                      <p>Job Applications: {jobApplications.length}</p>
                      <p>Gig Bookings: {gigBookings.length}</p>
                      <p>Exchange Proposals: {exchangeProposals.length}</p>
                      <p>Answers: {answers.length}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>My Jobs</CardTitle>
                  <Link to="/post-job">
                    <Button size="sm">Post New Job</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {jobs.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No jobs posted yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Applications</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobs.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell className="font-medium">{job.title}</TableCell>
                          <TableCell>{job.category}</TableCell>
                          <TableCell>₹{job.budget}</TableCell>
                          <TableCell>
                            <Badge>{job.status}</Badge>
                          </TableCell>
                          <TableCell>
                            {jobApplications.filter(a => a.job_id === job.id).length}
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => handleDeleteJob(job.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>My Projects</CardTitle>
                  <Link to="/upload-project">
                    <Button size="sm">Upload Project</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No projects uploaded yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium">{project.title}</TableCell>
                          <TableCell>{project.category}</TableCell>
                          <TableCell>
                            <Badge>{project.status}</Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(project.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gigs Tab */}
          <TabsContent value="gigs" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>My Gigs</CardTitle>
                  <Link to="/create-gig">
                    <Button size="sm">Create Gig</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {gigs.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No gigs created yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Bookings</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {gigs.map((gig) => (
                        <TableRow key={gig.id}>
                          <TableCell className="font-medium">{gig.title}</TableCell>
                          <TableCell>{gig.category}</TableCell>
                          <TableCell>₹{gig.price}</TableCell>
                          <TableCell>
                            <Badge>{gig.status}</Badge>
                          </TableCell>
                          <TableCell>
                            {gigBookings.filter(b => b.gig_id === gig.id).length}
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => handleDeleteGig(gig.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skill Exchanges Tab */}
          <TabsContent value="exchanges" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>My Skill Exchanges</CardTitle>
                  <Link to="/skill-exchange">
                    <Button size="sm">Create Exchange</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {skillExchanges.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No exchanges created yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Offering</TableHead>
                        <TableHead>Wanting</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Proposals</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {skillExchanges.map((exchange) => (
                        <TableRow key={exchange.id}>
                          <TableCell className="font-medium">{exchange.offering_skill}</TableCell>
                          <TableCell>{exchange.wanting_skill}</TableCell>
                          <TableCell>
                            <Badge>{exchange.status}</Badge>
                          </TableCell>
                          <TableCell>
                            {exchangeProposals.filter(p => p.exchange_id === exchange.id).length}
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => handleDeleteExchange(exchange.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Q&A Tab */}
          <TabsContent value="questions" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>My Questions</CardTitle>
                  <Link to="/ask-teach">
                    <Button size="sm">Post Question</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {questions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No questions posted yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Question</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Answers</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {questions.map((question) => (
                        <TableRow key={question.id}>
                          <TableCell className="font-medium">{question.question_title}</TableCell>
                          <TableCell>{question.category}</TableCell>
                          <TableCell>
                            <Badge>{question.status}</Badge>
                          </TableCell>
                          <TableCell>
                            {answers.filter(a => a.question_id === question.id).length}
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => handleDeleteQuestion(question.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approvals Tab */}
          <TabsContent value="approvals" className="space-y-4">
            {/* Job Applications */}
            <Card>
              <CardHeader>
                <CardTitle>Job Applications ({jobApplications.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {jobApplications.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No applications yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Job</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobApplications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">{app.full_name}</TableCell>
                          <TableCell>{app.jobs?.title}</TableCell>
                          <TableCell>{app.email}</TableCell>
                          <TableCell>
                            <Badge variant={
                              app.status === 'accepted' ? 'default' :
                              app.status === 'rejected' ? 'destructive' : 'secondary'
                            }>
                              {app.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {app.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="default"
                                  onClick={() => handleApproveApplication(app.id)}
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleRejectApplication(app.id)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Gig Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Gig Bookings ({gigBookings.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {gigBookings.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No bookings yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Buyer</TableHead>
                        <TableHead>Gig</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {gigBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.buyer_name}</TableCell>
                          <TableCell>{booking.gigs?.title}</TableCell>
                          <TableCell>₹{booking.total_amount}</TableCell>
                          <TableCell>
                            <Badge variant={
                              booking.status === 'confirmed' ? 'default' :
                              booking.status === 'cancelled' ? 'destructive' : 'secondary'
                            }>
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {booking.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="default"
                                  onClick={() => handleApproveBooking(booking.id)}
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleRejectBooking(booking.id)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Exchange Proposals */}
            <Card>
              <CardHeader>
                <CardTitle>Exchange Proposals ({exchangeProposals.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {exchangeProposals.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No proposals yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Proposer</TableHead>
                        <TableHead>Exchange</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {exchangeProposals.map((proposal) => (
                        <TableRow key={proposal.id}>
                          <TableCell className="font-medium">{proposal.proposer_name}</TableCell>
                          <TableCell>
                            {proposal.skill_exchanges?.offering_skill} ↔️ {proposal.skill_exchanges?.wanting_skill}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{proposal.message}</TableCell>
                          <TableCell>
                            <Badge variant={
                              proposal.status === 'accepted' ? 'default' :
                              proposal.status === 'rejected' ? 'destructive' : 'secondary'
                            }>
                              {proposal.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {proposal.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="default"
                                  onClick={() => handleApproveProposal(proposal.id)}
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleRejectProposal(proposal.id)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;