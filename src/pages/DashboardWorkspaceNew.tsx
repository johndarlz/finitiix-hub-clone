import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Briefcase, Calendar, DollarSign, Eye, Edit, Trash2, Plus, CheckCircle, 
  Clock, AlertCircle, Rocket, BookOpen, Users, MessageSquare, Zap, Code 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Job {
  id: string;
  title: string;
  category: string;
  budget: number;
  status: string;
  created_at: string;
  job_applications?: Array<{
    id: string;
    full_name: string;
    email: string;
    status: string;
    created_at: string;
  }>;
}

interface Project {
  id: string;
  title: string;
  category: string;
  short_description: string;
  status: string;
  created_at: string;
  live_demo_url?: string;
  github_url?: string;
}

const DashboardWorkspaceNew = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("workzone");

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch WorkZone jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from("jobs")
        .select(`
          *,
          job_applications (
            id,
            full_name,
            email,
            status,
            created_at
          )
        `)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (jobsError) throw jobsError;

      // Fetch ProjectHub projects
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (projectsError) throw projectsError;

      setJobs(jobsData || []);
      setProjects(projectsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch your data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", jobId);

      if (error) throw error;

      setJobs(jobs.filter(job => job.id !== jobId));
      toast({
        title: "Success",
        description: "Job deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting job:", error);
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) throw error;

      setProjects(projects.filter(project => project.id !== projectId));
      toast({
        title: "Success",
        description: "Project deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error", 
        description: "Failed to delete project",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success text-success-foreground";
      case "completed": return "bg-primary text-primary-foreground";
      case "paused": return "bg-muted text-muted-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your workspace...</p>
        </div>
      </div>
    );
  }

  const moduleStats = [
    { 
      title: "WorkZone Jobs", 
      value: jobs.length, 
      icon: <Briefcase className="w-5 h-5" />,
      color: "text-blue-600"
    },
    { 
      title: "ProjectHub Projects", 
      value: projects.length, 
      icon: <Rocket className="w-5 h-5" />,
      color: "text-purple-600"
    },
    { 
      title: "EduTask Courses", 
      value: 0, 
      icon: <BookOpen className="w-5 h-5" />,
      color: "text-green-600"
    },
    { 
      title: "BubbleGigs Videos", 
      value: 0, 
      icon: <Users className="w-5 h-5" />,
      color: "text-orange-600"
    },
    { 
      title: "SkillExchange", 
      value: 0, 
      icon: <Zap className="w-5 h-5" />,
      color: "text-pink-600"
    },
    { 
      title: "Ask & Teach Q&As", 
      value: 0, 
      icon: <MessageSquare className="w-5 h-5" />,
      color: "text-indigo-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Workspace</h1>
      </div>

      {/* Module Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {moduleStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={stat.color}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                Total created
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Module Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="workzone">WorkZone</TabsTrigger>
          <TabsTrigger value="projecthub">ProjectHub</TabsTrigger>
          <TabsTrigger value="edutask">EduTask</TabsTrigger>
          <TabsTrigger value="bubblegigs">BubbleGigs</TabsTrigger>
          <TabsTrigger value="skillexchange">SkillExchange</TabsTrigger>
          <TabsTrigger value="askteach">Ask & Teach</TabsTrigger>
        </TabsList>

        {/* WorkZone Tab */}
        <TabsContent value="workzone" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">WorkZone Jobs</h2>
            <Button onClick={() => window.location.href = '/post-job'}>
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{job.title}</h3>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {job.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          ₹{Number(job.budget).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(job.created_at), "MMM dd, yyyy")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {job.job_applications?.length || 0} applications
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDeleteJob(job.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}

                {jobs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No jobs posted yet</p>
                    <p className="text-sm">Start by posting your first job in WorkZone</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ProjectHub Tab */}
        <TabsContent value="projecthub" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">ProjectHub Projects</h2>
            <Button onClick={() => window.location.href = '/upload-project'}>
              <Plus className="w-4 h-4 mr-2" />
              Upload Project
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{project.title}</h3>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Code className="w-3 h-3" />
                          {project.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(project.created_at), "MMM dd, yyyy")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{project.short_description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {project.live_demo_url && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer">
                            <Eye className="w-3 h-3" />
                          </a>
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}

                {projects.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Rocket className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No projects uploaded yet</p>
                    <p className="text-sm">Start by uploading your first project to ProjectHub</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Placeholder tabs for other modules */}
        <TabsContent value="edutask">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>EduTask courses coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bubblegigs">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>BubbleGigs video pitches coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skillexchange">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8 text-muted-foreground">
                <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>SkillExchange collaborations coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="askteach">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Ask & Teach Q&A coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardWorkspaceNew;