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
  Filter,
  CheckCircle,
  Gift,
  MessageSquare,
  BookOpen,
  Coins
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
  const [uploadedProjects, setUploadedProjects] = useState<any[]>([]);
  const [userGigs, setUserGigs] = useState<any[]>([]);
  const [gigBookings, setGigBookings] = useState<any[]>([]);
  const [userExchanges, setUserExchanges] = useState<any[]>([]);
  const [exchangeProposals, setExchangeProposals] = useState<any[]>([]);
  const [userQuestions, setUserQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
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

      // Fetch uploaded projects by user
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      // Fetch user's gigs
      const { data: gigsData, error: gigsError } = await supabase
        .from('gigs')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (gigsError) throw gigsError;

      // Fetch gig bookings for user's gigs
      const gigIds = gigsData?.map(gig => gig.id) || [];
      let bookingsData: any[] = [];
      if (gigIds.length > 0) {
        const { data, error: bookingsError } = await supabase
          .from('gig_bookings')
          .select('*, gigs(title)')
          .in('gig_id', gigIds)
          .order('created_at', { ascending: false });
        if (bookingsError) throw bookingsError;
        bookingsData = data || [];
      }

      // Fetch user's skill exchanges
      const { data: exchangesData, error: exchangesError } = await supabase
        .from('skill_exchanges')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (exchangesError) throw exchangesError;

      // Fetch exchange proposals for user's exchanges
      const exchangeIds = exchangesData?.map(ex => ex.id) || [];
      let proposalsData: any[] = [];
      if (exchangeIds.length > 0) {
        const { data, error: proposalsError } = await supabase
          .from('skill_exchange_proposals')
          .select('*, skill_exchanges(offering_skill, wanting_skill)')
          .in('exchange_id', exchangeIds)
          .order('created_at', { ascending: false });
        if (proposalsError) throw proposalsError;
        proposalsData = data || [];
      }

      // Fetch user's questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (questionsError) throw questionsError;

      // Fetch user's answers
      const { data: answersData, error: answersError } = await supabase
        .from('answers')
        .select('*, questions(question_title)')
        .eq('mentor_user_id', user?.id)
        .order('created_at', { ascending: false });

      if (answersError) throw answersError;

      setPostedJobs(postedJobsData || []);
      setAppliedJobs(appliedJobsData || []);
      setApplications(applicationsData);
      setUploadedProjects(projectsData || []);
      setUserGigs(gigsData || []);
      setGigBookings(bookingsData);
      setUserExchanges(exchangesData || []);
      setExchangeProposals(proposalsData);
      setUserQuestions(questionsData || []);
      setUserAnswers(answersData || []);

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
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Workspace</h1>
            <p className="text-muted-foreground">Manage all your activities across FinitixHub</p>
          </div>
          <Link to="/post-job">
            <Button className="hover-scale">
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
                  placeholder="Search across all modules..."
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="posted">WorkZone ({postedJobs.length})</TabsTrigger>
            <TabsTrigger value="applied">Applications ({appliedJobs.length})</TabsTrigger>
            <TabsTrigger value="projects">ProjectHub ({uploadedProjects.length})</TabsTrigger>
            <TabsTrigger value="bubblegigs">BubbleGigs ({userGigs.length})</TabsTrigger>
            <TabsTrigger value="skillexchange">SkillExchange ({userExchanges.length})</TabsTrigger>
            <TabsTrigger value="edutask">Ask&Teach ({userQuestions.length})</TabsTrigger>
          </TabsList>

          {/* Posted Jobs */}
          <TabsContent value="posted" className="space-y-4">
            {postedJobs.length > 0 ? (
              <div className="grid gap-4">
                {postedJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-all animate-fade-in hover-scale">
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
                  <Card key={application.id} className="hover:shadow-lg transition-all animate-fade-in hover-scale">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">{application.jobs.title}</CardTitle>
                            <Badge className={getStatusColor(application.status)}>
                              {application.status}
                            </Badge>
                            {application.status === 'accepted' && (
                              <Badge className="bg-success text-white animate-pulse">
                                🎉 Selected!
                              </Badge>
                            )}
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
                      <p className="text-foreground leading-relaxed line-clamp-2 mb-4">
                        {application.why_hire_me}
                      </p>
                      {application.status === 'accepted' && (
                        <div className="p-4 bg-success/10 border border-success rounded-lg animate-fade-in">
                          <p className="text-success font-semibold flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            Congratulations! You've been selected for this job. The job poster will contact you soon.
                          </p>
                        </div>
                      )}
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

          {/* Projects */}
          <TabsContent value="projects" className="space-y-4">
            {uploadedProjects.length > 0 ? (
              <div className="grid gap-4">
                {uploadedProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-all animate-fade-in hover-scale">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">{project.title}</CardTitle>
                            <Badge className={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <Badge variant="outline" className="text-xs">{project.category}</Badge>
                            <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground leading-relaxed line-clamp-2 mb-4">
                        {project.short_description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies?.slice(0, 5).map((tech: string, techIndex: number) => (
                          <Badge key={techIndex} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies?.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.technologies.length - 5} more
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
                  <h3 className="text-xl font-semibold mb-2">No projects uploaded yet</h3>
                  <p className="text-muted-foreground mb-4">Start by uploading your first project</p>
                  <Link to="/upload-project">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Upload Your First Project
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* BubbleGigs */}
          <TabsContent value="bubblegigs" className="space-y-4">
            {userGigs.length > 0 || gigBookings.length > 0 ? (
              <div className="space-y-6">
                {/* My Gigs */}
                {userGigs.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Gift className="w-5 h-5" />
                      My Gigs ({userGigs.length})
                    </h3>
                    <div className="grid gap-4">
                      {userGigs.map((gig) => (
                        <Card key={gig.id} className="hover:shadow-lg transition-all animate-fade-in hover-scale">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <CardTitle className="text-lg">{gig.title}</CardTitle>
                                  <Badge className={getStatusColor(gig.status)}>
                                    {gig.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="w-4 h-4" />
                                    <span>₹{gig.price}</span>
                                  </div>
                                  <Badge variant="outline" className="text-xs">{gig.category}</Badge>
                                  <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    <span>{gigBookings.filter(b => b.gig_id === gig.id).length} bookings</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-foreground leading-relaxed line-clamp-2">
                              {gig.description}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Received Bookings */}
                {gigBookings.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Bookings Received ({gigBookings.length})
                    </h3>
                    <div className="grid gap-4">
                      {gigBookings.map((booking) => (
                        <Card key={booking.id} className="hover:shadow-lg transition-all animate-fade-in hover-scale">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <CardTitle className="text-lg">{booking.gigs.title}</CardTitle>
                                  <Badge className={getStatusColor(booking.status)}>
                                    {booking.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>From: {booking.buyer_name}</span>
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="w-4 h-4" />
                                    <span>₹{booking.total_amount}</span>
                                  </div>
                                  <span>{new Date(booking.created_at).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-foreground leading-relaxed line-clamp-2">
                              {booking.project_requirements}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Gift className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No gigs posted yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first gig and start earning</p>
                  <Link to="/bubble-gigs">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Gig
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* SkillExchange */}
          <TabsContent value="skillexchange" className="space-y-4">
            {userExchanges.length > 0 || exchangeProposals.length > 0 ? (
              <div className="space-y-6">
                {/* My Exchanges */}
                {userExchanges.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      My Skill Exchanges ({userExchanges.length})
                    </h3>
                    <div className="grid gap-4">
                      {userExchanges.map((exchange) => (
                        <Card key={exchange.id} className="hover:shadow-lg transition-all animate-fade-in hover-scale">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <CardTitle className="text-lg">
                                    {exchange.offering_skill} ↔️ {exchange.wanting_skill}
                                  </CardTitle>
                                  <Badge className={getStatusColor(exchange.status)}>
                                    {exchange.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <Badge variant="outline" className="text-xs">{exchange.category}</Badge>
                                  {exchange.coins > 0 && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                      <Coins className="w-3 h-3" />
                                      {exchange.coins} coins
                                    </Badge>
                                  )}
                                  <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    <span>{exchangeProposals.filter(p => p.exchange_id === exchange.id).length} proposals</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-foreground leading-relaxed line-clamp-2">
                              {exchange.description}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Received Proposals */}
                {exchangeProposals.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Proposals Received ({exchangeProposals.length})
                    </h3>
                    <div className="grid gap-4">
                      {exchangeProposals.map((proposal) => (
                        <Card key={proposal.id} className="hover:shadow-lg transition-all animate-fade-in hover-scale">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <CardTitle className="text-lg">
                                    {proposal.skill_exchanges.offering_skill} ↔️ {proposal.skill_exchanges.wanting_skill}
                                  </CardTitle>
                                  <Badge className={getStatusColor(proposal.status)}>
                                    {proposal.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>From: {proposal.proposer_name}</span>
                                  <span>{new Date(proposal.created_at).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-foreground leading-relaxed line-clamp-2">
                              {proposal.message}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No skill exchanges yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first skill exchange</p>
                  <Link to="/skill-exchange">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Exchange
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Ask & Teach (Questions & Answers) */}
          <TabsContent value="edutask" className="space-y-4">
            {userQuestions.length > 0 || userAnswers.length > 0 ? (
              <div className="space-y-6">
                {/* My Questions */}
                {userQuestions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      My Questions ({userQuestions.length})
                    </h3>
                    <div className="grid gap-4">
                      {userQuestions.map((question) => (
                        <Card key={question.id} className="hover:shadow-lg transition-all animate-fade-in hover-scale">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <CardTitle className="text-lg">{question.question_title}</CardTitle>
                                  <Badge className={getStatusColor(question.status)}>
                                    {question.status}
                                  </Badge>
                                  {question.bounty > 0 && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                      <Coins className="w-3 h-3" />
                                      ₹{question.bounty}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <Badge variant="outline" className="text-xs">{question.category}</Badge>
                                  <span>Asked {new Date(question.created_at).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-foreground leading-relaxed line-clamp-2">
                              {question.question_details}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* My Answers */}
                {userAnswers.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      My Answers ({userAnswers.length})
                    </h3>
                    <div className="grid gap-4">
                      {userAnswers.map((answer) => (
                        <Card key={answer.id} className="hover:shadow-lg transition-all animate-fade-in hover-scale">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <CardTitle className="text-lg">{answer.questions.question_title}</CardTitle>
                                  {answer.is_accepted && (
                                    <Badge className="bg-success text-white flex items-center gap-1">
                                      <CheckCircle className="w-3 h-3" />
                                      Accepted
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>Answered {new Date(answer.created_at).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-foreground leading-relaxed line-clamp-2">
                              {answer.answer_content}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No questions or answers yet</h3>
                  <p className="text-muted-foreground mb-4">Start asking questions or become a mentor</p>
                  <Link to="/ask-teach">
                    <Button>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Visit Ask & Teach
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
