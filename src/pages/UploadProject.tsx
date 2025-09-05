import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Github, Globe, Video, Cloud, Rocket, Check } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const UploadProject = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    shortDescription: "",
    detailedOverview: "",
    technologies: [] as string[],
    authorName: "",
    contactEmail: "",
    githubUrl: "",
    driveUrl: "",
    liveDemoUrl: "",
    videoDemoUrl: "",
    additionalNotes: ""
  });
  
  const [techInput, setTechInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const projectCategories = [
    "Software / App Development",
    "Website / Web App", 
    "Design (Logo, UI/UX, Graphics)",
    "Data Science / AI / ML",
    "Research / Report",
    "Marketing / Content",
    "Other"
  ];

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
      }));
      setTechInput("");
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload a project.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          title: formData.title,
          category: formData.category,
          short_description: formData.shortDescription,
          detailed_overview: formData.detailedOverview,
          technologies: formData.technologies,
          github_url: formData.githubUrl || null,
          drive_url: formData.driveUrl || null,
          live_demo_url: formData.liveDemoUrl || null,
          video_demo_url: formData.videoDemoUrl || null,
          author_name: formData.authorName,
          contact_email: formData.contactEmail,
          additional_notes: formData.additionalNotes || null
        });

      if (error) throw error;

      toast({
        title: "Project uploaded successfully!",
        description: "Your project is now live on ProjectHub.",
      });

      // Reset form
      setFormData({
        title: "",
        category: "",
        shortDescription: "",
        detailedOverview: "",
        technologies: [],
        authorName: "",
        contactEmail: "",
        githubUrl: "",
        driveUrl: "",
        liveDemoUrl: "",
        videoDemoUrl: "",
        additionalNotes: ""
      });
    } catch (error) {
      console.error("Error uploading project:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-secondary/10 via-background to-primary/10 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Upload Project
                </span>{" "}
                to ProjectHub
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Share your project with the world. Let companies and recruiters discover your talent through your work.
              </p>
            </div>
          </div>
        </section>

        {/* Upload Form */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="w-6 h-6" />
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Project Title */}
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium">Project Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter your project name"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <Label htmlFor="category" className="text-sm font-medium">Project Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project category" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Short Description */}
                  <div>
                    <Label htmlFor="shortDescription" className="text-sm font-medium">Short Description *</Label>
                    <Textarea
                      id="shortDescription"
                      value={formData.shortDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                      placeholder="Briefly explain your project in 3-5 sentences"
                      rows={3}
                      required
                    />
                  </div>

                  {/* Detailed Overview */}
                  <div>
                    <Label htmlFor="detailedOverview" className="text-sm font-medium">Detailed Project Overview</Label>
                    <Textarea
                      id="detailedOverview"
                      value={formData.detailedOverview}
                      onChange={(e) => setFormData(prev => ({ ...prev, detailedOverview: e.target.value }))}
                      placeholder="Describe your project in detail"
                      rows={5}
                    />
                  </div>

                  {/* Technologies */}
                  <div>
                    <Label htmlFor="technologies" className="text-sm font-medium">Technologies / Tools Used</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        placeholder="e.g., Python, Flutter, React, Figma"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                      />
                      <Button type="button" onClick={addTechnology} variant="outline">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.technologies.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {tech}
                          <X 
                            className="w-3 h-3 cursor-pointer" 
                            onClick={() => removeTechnology(tech)} 
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Links Section */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="githubUrl" className="text-sm font-medium flex items-center gap-2">
                        <Github className="w-4 h-4" />
                        GitHub / GitLab URL
                      </Label>
                      <Input
                        id="githubUrl"
                        value={formData.githubUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                        placeholder="https://github.com/username/project"
                      />
                    </div>

                    <div>
                      <Label htmlFor="driveUrl" className="text-sm font-medium flex items-center gap-2">
                        <Cloud className="w-4 h-4" />
                        Google Drive / Dropbox
                      </Label>
                      <Input
                        id="driveUrl"
                        value={formData.driveUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, driveUrl: e.target.value }))}
                        placeholder="https://drive.google.com/..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="liveDemoUrl" className="text-sm font-medium flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Live Demo / Website
                      </Label>
                      <Input
                        id="liveDemoUrl"
                        value={formData.liveDemoUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, liveDemoUrl: e.target.value }))}
                        placeholder="https://your-project.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="videoDemoUrl" className="text-sm font-medium flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        Video Demo (YouTube, Loom)
                      </Label>
                      <Input
                        id="videoDemoUrl"
                        value={formData.videoDemoUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, videoDemoUrl: e.target.value }))}
                        placeholder="https://youtube.com/..."
                      />
                    </div>
                  </div>

                  {/* Author Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="authorName" className="text-sm font-medium">Author / Team Name *</Label>
                      <Input
                        id="authorName"
                        value={formData.authorName}
                        onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
                        placeholder="Your name or team name"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactEmail" className="text-sm font-medium">Contact Email *</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <Label htmlFor="additionalNotes" className="text-sm font-medium">Additional Notes</Label>
                    <Textarea
                      id="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                      placeholder="Anything else about the project..."
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Uploading..."
                    ) : (
                      <>
                        <Upload className="w-5 h-5 mr-2" />
                        Upload Project
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-gradient-card">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How Uploading Projects Works</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Fill Project Details</h3>
                <p className="text-muted-foreground">Provide comprehensive information about your project including technologies and links</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload & Share</h3>
                <p className="text-muted-foreground">Your project goes live instantly and becomes part of your public portfolio</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-success text-success-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Discovered</h3>
                <p className="text-muted-foreground">Recruiters and companies browse projects to find talented developers like you</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default UploadProject;