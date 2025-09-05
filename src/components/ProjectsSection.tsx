import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Heart, 
  Share2, 
  Star, 
  Play, 
  Github, 
  ExternalLink,
  Calendar,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProjectsSection = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error loading projects",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLiveDemo = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleGithub = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleShare = async (project: any) => {
    try {
      await navigator.share({
        title: project.title,
        text: project.short_description,
        url: window.location.href
      });
    } catch (error) {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Project link copied to clipboard."
        });
      } catch (clipboardError) {
        toast({
          title: "Share failed",
          description: "Unable to share project.",
          variant: "destructive"
        });
      }
    }
  };

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Community Projects</h2>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Community Projects</h2>
        
        {projects.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Card key={project.id} className="group hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">
                        {project.category === 'Software / App Development' && '💻'}
                        {project.category === 'Website / Web App' && '🌐'}
                        {project.category === 'Design (Logo, UI/UX, Graphics)' && '🎨'}
                        {project.category === 'Data Science / AI / ML' && '🤖'}
                        {project.category === 'Research / Report' && '📊'}
                        {project.category === 'Marketing / Content' && '📢'}
                        {!['Software / App Development', 'Website / Web App', 'Design (Logo, UI/UX, Graphics)', 'Data Science / AI / ML', 'Research / Report', 'Marketing / Content'].includes(project.category) && '📁'}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {project.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-3 h-3" />
                      <span>by {project.author_name}</span>
                      <Calendar className="w-3 h-3 ml-2" />
                      <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <CardDescription className="text-foreground leading-relaxed line-clamp-3">
                      {project.short_description}
                    </CardDescription>
                    
                    <div className="flex flex-wrap gap-2">
                      {project.technologies?.slice(0, 4).map((tech: string, techIndex: number) => (
                        <Badge key={techIndex} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies?.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.technologies.length - 4} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>0</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>0</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-primary text-primary" />
                          <span>5.0</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {project.live_demo_url && (
                        <Button 
                          variant="hero" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleLiveDemo(project.live_demo_url)}
                        >
                          <Play className="w-4 h-4" />
                          Live Demo
                        </Button>
                      )}
                      {project.github_url && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleGithub(project.github_url)}
                        >
                          <Github className="w-4 h-4" />
                          Code
                        </Button>
                      )}
                      {project.drive_url && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => window.open(project.drive_url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                          Files
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleShare(project)}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Projects
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-6">Be the first to share your amazing project with the community!</p>
            <Button variant="hero" onClick={() => window.location.href = '/upload-project'}>
              Upload Your Project
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;