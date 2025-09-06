import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  LogOut, 
  Briefcase, 
  Plus, 
  Clock, 
  DollarSign,
  Eye,
  Edit3,
  Trash2,
  Users
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface MiniWorkspaceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceData: {
    postedJobs: any[];
    appliedJobs: any[];
    uploadedProjects: any[];
    applications: any[];
  };
}

export function MiniWorkspace({ open, onOpenChange, workspaceData }: MiniWorkspaceProps) {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({ title: "Signed out successfully" });
      navigate('/');
      onOpenChange(false);
    } catch (error) {
      toast({ title: "Error signing out", variant: "destructive" });
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">My Workspace</DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/')}>
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="workzone" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="workzone">WorkZone ({workspaceData.postedJobs.length})</TabsTrigger>
            <TabsTrigger value="applications">Applications ({workspaceData.appliedJobs.length})</TabsTrigger>
            <TabsTrigger value="projects">ProjectHub ({workspaceData.uploadedProjects.length})</TabsTrigger>
            <TabsTrigger value="edutask">EduTask (0)</TabsTrigger>
            <TabsTrigger value="bubblegigs">BubbleGigs (0)</TabsTrigger>
            <TabsTrigger value="skillexchange">SkillExchange (0)</TabsTrigger>
          </TabsList>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>Jobs Posted</span>
                  <Badge variant="secondary">{workspaceData.postedJobs.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Applications Submitted</span>
                  <Badge variant="secondary">{workspaceData.appliedJobs.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Projects Uploaded</span>
                  <Badge variant="secondary">{workspaceData.uploadedProjects.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Applications Received</span>
                  <Badge variant="secondary">{workspaceData.applications.length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* WorkZone Tab */}
          <TabsContent value="workzone" className="space-y-4">
            {workspaceData.postedJobs.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {workspaceData.postedJobs.slice(0, 3).map((job) => (
                  <Card key={job.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{job.title}</h3>
                            <Badge className={getStatusColor(job.status)} style={{fontSize: '10px'}}>
                              {job.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              <span>₹{job.budget}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{workspaceData.applications.filter(app => app.job_id === job.id).length} applications</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">{job.description}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit3 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-semibold mb-2">No jobs posted yet</h3>
                <Link to="/post-job">
                  <Button size="sm" onClick={() => onOpenChange(false)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Post Your First Job
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-4">
            {workspaceData.appliedJobs.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {workspaceData.appliedJobs.slice(0, 3).map((application) => (
                  <Card key={application.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{application.jobs?.title}</h3>
                            <Badge className={getStatusColor(application.status)} style={{fontSize: '10px'}}>
                              {application.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              <span>₹{application.expected_budget}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Applied {new Date(application.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">{application.why_hire_me}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-semibold mb-2">No applications yet</h3>
                <Link to="/workzone">
                  <Button size="sm" onClick={() => onOpenChange(false)}>
                    <Briefcase className="w-4 h-4 mr-2" />
                    Browse Jobs
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            {workspaceData.uploadedProjects.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {workspaceData.uploadedProjects.slice(0, 3).map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{project.title}</h3>
                            <Badge className={getStatusColor(project.status)} style={{fontSize: '10px'}}>
                              {project.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                            <Badge variant="outline" className="text-xs">{project.category}</Badge>
                            <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">{project.short_description}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit3 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-semibold mb-2">No projects uploaded yet</h3>
                <Link to="/upload-project">
                  <Button size="sm" onClick={() => onOpenChange(false)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Your First Project
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          {/* Other Tabs */}
          <TabsContent value="edutask" className="text-center py-12">
            <h3 className="font-semibold mb-2">EduTask Coming Soon</h3>
            <p className="text-muted-foreground">Educational tasks and learning modules will be available here.</p>
          </TabsContent>

          <TabsContent value="bubblegigs" className="text-center py-12">
            <h3 className="font-semibold mb-2">BubbleGigs Coming Soon</h3>
            <p className="text-muted-foreground">Your created gigs will be displayed here.</p>
          </TabsContent>

          <TabsContent value="skillexchange" className="text-center py-12">
            <h3 className="font-semibold mb-2">SkillExchange Coming Soon</h3>
            <p className="text-muted-foreground">Skill exchange activities will be available here.</p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
