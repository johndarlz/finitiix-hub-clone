import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Github, 
  Linkedin, 
  Download, 
  Star, 
  Calendar, 
  Award,
  MessageCircle,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Eye,
  Heart,
  ExternalLink,
  Share2,
  ChevronRight,
  Building,
  Clock,
  CheckCircle,
  Users,
  BookOpen,
  Trophy,
  Target,
  Zap,
  Play,
  FileText,
  Link as LinkIcon,
  Quote
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ShareableProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [achievements, setAchievements] = useState<any>({
    jobsCompleted: 0,
    projectsUploaded: 0,
    gigsPosted: 0,
    applicationsReceived: 0,
    coursesCompleted: 0,
    avgRating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      // First get the user by username from profiles table
      const { data: userProfileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .maybeSingle();

      if (profileError || !userProfileData) {
        console.error("Error fetching user profile:", profileError);
        setLoading(false);
        return;
      }

      setUserProfile(userProfileData);

      // Then get the detailed profile from myprofile table
      const { data: detailedProfile, error: detailError } = await supabase
        .from("myprofile")
        .select("*")
        .eq("user_id", userProfileData.user_id)
        .maybeSingle();

      if (detailError && detailError.code !== 'PGRST116') {
        console.error("Error fetching detailed profile:", detailError);
      }

      setProfile(detailedProfile);

      // Fetch achievements data
      await fetchAchievements(userProfileData.user_id);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAchievements = async (userId: string) => {
    try {
      // Get jobs posted
      const { data: jobs } = await supabase
        .from("jobs")
        .select("id, status")
        .eq("user_id", userId);

      // Get projects uploaded
      const { data: projects } = await supabase
        .from("projects")
        .select("id, status")
        .eq("user_id", userId);

      // Get gigs posted
      const { data: gigs } = await supabase
        .from("gigs")
        .select("id, status")
        .eq("user_id", userId);

      // Get applications received (for jobs posted by this user)
      const { data: applications } = await supabase
        .from("job_applications")
        .select("id, job_id, jobs!inner(user_id)")
        .eq("jobs.user_id", userId);

      // Get bookings received (for gigs posted by this user)
      const { data: bookings } = await supabase
        .from("gig_bookings")
        .select("id, gig_id, gigs!inner(user_id)")
        .eq("gigs.user_id", userId);

      setAchievements({
        jobsCompleted: jobs?.filter(j => j.status === 'completed').length || 0,
        jobsPosted: jobs?.length || 0,
        projectsUploaded: projects?.length || 0,
        gigsPosted: gigs?.length || 0,
        applicationsReceived: applications?.length || 0,
        bookingsReceived: bookings?.length || 0,
        coursesCompleted: 0, // Placeholder for future EduTask integration
        avgRating: 4.8 // Placeholder for future rating system
      });
    } catch (error) {
      console.error("Error fetching achievements:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground">The requested profile does not exist or is not public.</p>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDownloadResume = () => {
    if (profile?.resume_url) {
      window.open(profile.resume_url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold">
                F
              </div>
              <span className="font-semibold">FinitixHub</span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
              <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                <User className="w-4 h-4 mr-2" />
                Hire Me
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-20 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Cover Image placeholder */}
            <div className="absolute inset-0 -z-10 opacity-30">
              <div className="w-full h-full bg-gradient-hero"></div>
            </div>
            
            {/* Profile Picture */}
            <div className="relative inline-block mb-6">
              <Avatar className="w-40 h-40 mx-auto border-4 border-white shadow-strong">
                <AvatarImage src={profile?.profile_picture} />
                <AvatarFallback className="text-4xl bg-white text-primary">
                  {getInitials(profile?.full_name || userProfile?.name || "U")}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 bg-success text-white px-3 py-1 rounded-full text-sm font-medium">
                Open to Work
              </div>
            </div>

            <h1 className="text-5xl font-bold mb-2">
              {profile?.full_name || userProfile?.name || "Anonymous User"}
            </h1>
            <p className="text-xl mb-2">@{username}</p>
            <p className="text-2xl text-white/90 font-medium mb-6">
              {profile?.headline || "Professional looking for opportunities"}
            </p>

            {/* Location & Contact */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-white/80">
              {profile?.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile?.contact_email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  <span>{profile.contact_email}</span>
                </div>
              )}
              {profile?.phone_number && (
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <span>{profile.phone_number}</span>
                </div>
              )}
            </div>

            {/* Bio */}
            <p className="text-lg text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              {profile?.bio || "Passionate professional ready to contribute to exciting projects and opportunities."}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                <MessageCircle className="w-5 h-5 mr-2" />
                Contact Me
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <User className="w-5 h-5 mr-2" />
                Hire Me
              </Button>
              {profile?.resume_url && (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-primary"
                  onClick={handleDownloadResume}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Resume
                </Button>
              )}
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <Share2 className="w-5 h-5 mr-2" />
                Share Profile
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* About Me */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  About Me
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {profile?.bio || "Passionate professional with expertise in multiple domains."}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Experience: {profile?.years_experience || 0} years</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <span>Available for freelance</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-primary" />
                  Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {profile?.social_links?.github && (
                    <a 
                      href={profile.social_links.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
                    >
                      <Github className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                      <span className="text-sm">GitHub</span>
                      <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
                    </a>
                  )}
                  {profile?.social_links?.linkedin && (
                    <a 
                      href={profile.social_links.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
                    >
                      <Linkedin className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                      <span className="text-sm">LinkedIn</span>
                      <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
                    </a>
                  )}
                  {profile?.social_links?.website && (
                    <a 
                      href={profile.social_links.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
                    >
                      <Globe className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                      <span className="text-sm">Portfolio</span>
                      <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
                    </a>
                  )}
                  {profile?.resume_url && (
                    <button 
                      onClick={handleDownloadResume}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group w-full text-left"
                    >
                      <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                      <span className="text-sm">Resume/CV</span>
                      <Download className="w-3 h-3 ml-auto text-muted-foreground" />
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            {profile?.skills && profile.skills.length > 0 && (
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-primary" />
                    Skills & Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profile.skills.map((skill: string, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Progress value={75 + Math.random() * 25} className="w-16 h-2" />
                          <span className="text-xs text-muted-foreground">Expert</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Languages */}
            {profile?.languages && profile.languages.length > 0 && (
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    Languages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {profile.languages.map((language: string, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{language}</span>
                        <Badge variant="outline" className="text-xs">Native</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* FinitixHub Achievements */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  FinitixHub Achievements
                  <Badge variant="secondary" className="ml-auto">Live Stats</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center text-white">
                      <Briefcase className="w-8 h-8" />
                    </div>
                    <div className="text-2xl font-bold">{achievements.jobsPosted}</div>
                    <div className="text-sm text-muted-foreground">Jobs Posted</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center text-white">
                      <Code className="w-8 h-8" />
                    </div>
                    <div className="text-2xl font-bold">{achievements.projectsUploaded}</div>
                    <div className="text-sm text-muted-foreground">Projects Uploaded</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center text-white">
                      <Zap className="w-8 h-8" />
                    </div>
                    <div className="text-2xl font-bold">{achievements.gigsPosted}</div>
                    <div className="text-sm text-muted-foreground">Gigs Posted</div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10">
                    <CheckCircle className="w-6 h-6 text-success" />
                    <div>
                      <div className="font-medium">{achievements.applicationsReceived} Applications</div>
                      <div className="text-sm text-muted-foreground">Received on posted jobs</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10">
                    <Star className="w-6 h-6 text-primary" />
                    <div>
                      <div className="font-medium">{achievements.avgRating} Rating</div>
                      <div className="text-sm text-muted-foreground">Average client rating</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Projects */}
            {profile?.portfolio_projects && profile.portfolio_projects.length > 0 && (
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-primary" />
                    Portfolio Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {profile.portfolio_projects.map((project: any, index: number) => (
                      <div key={index} className="group relative overflow-hidden rounded-lg border hover:shadow-medium transition-all duration-300">
                        <div className="aspect-video bg-gradient-card p-6 flex items-center justify-center">
                          <Code className="w-12 h-12 text-primary/50" />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {project.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Eye className="w-3 h-3" />
                              <span>234</span>
                              <Heart className="w-3 h-3" />
                              <span>12</span>
                            </div>
                            <div className="flex gap-2">
                              {project.links?.demo && (
                                <Button size="sm" variant="outline" asChild>
                                  <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </Button>
                              )}
                              {project.links?.github && (
                                <Button size="sm" variant="outline" asChild>
                                  <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                                    <Github className="w-3 h-3" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Experience & Work History */}
            {profile?.work_experience && profile.work_experience.length > 0 && (
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Experience & Work History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {profile.work_experience.map((exp: any, index: number) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white">
                            <Building className="w-6 h-6" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{exp.role}</h3>
                          <p className="text-primary font-medium">{exp.company}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                            <Clock className="w-4 h-4" />
                            <span>{exp.duration}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{exp.responsibilities}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-primary fill-primary" />
                              <span className="text-sm">4.9</span>
                            </div>
                            <span className="text-sm text-muted-foreground">Client Rating</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Education */}
            {profile?.education && profile.education.length > 0 && (
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.education.map((edu: any, index: number) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-secondary" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold">{edu.degree}</h3>
                          <p className="text-primary font-medium">{edu.institution}</p>
                          <p className="text-sm text-muted-foreground">{edu.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Certifications */}
            {profile?.certifications && profile.certifications.length > 0 && (
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Certifications & Learning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {profile.certifications.map((cert: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4 hover:shadow-soft transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded bg-gradient-primary flex items-center justify-center text-white flex-shrink-0">
                            <Award className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{cert.name}</h4>
                            <p className="text-sm text-muted-foreground">{cert.issued_by}</p>
                            {cert.certificate_url && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="mt-2"
                                asChild
                              >
                                <a href={cert.certificate_url} target="_blank" rel="noopener noreferrer">
                                  <Download className="w-3 h-3 mr-2" />
                                  View Certificate
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews & Testimonials */}
            {profile?.testimonials && profile.testimonials.length > 0 && (
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Quote className="w-5 h-5 text-primary" />
                    Reviews & Testimonials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {profile.testimonials.map((testimonial: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4 hover:shadow-soft transition-shadow">
                        <div className="flex items-center gap-2 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < testimonial.rating
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm mb-4 italic">"{testimonial.message}"</p>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {testimonial.author?.charAt(0) || "A"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{testimonial.author}</div>
                            <div className="text-xs text-muted-foreground">Client</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact & Hire Section */}
            <Card className="shadow-soft bg-gradient-card">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Ready to Work Together?</h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  I'm currently available for new projects and opportunities. Let's discuss how I can help bring your ideas to life.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                  <Button size="lg" variant="outline">
                    <User className="w-5 h-5 mr-2" />
                    Hire Me
                  </Button>
                  <Button size="lg" variant="outline">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Book Mentorship
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted/30 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">
              F
            </div>
            <span className="text-sm text-muted-foreground">
              Powered by <span className="font-semibold text-primary">FinitixHub</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Create your professional portfolio at FinitixHub
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ShareableProfile;