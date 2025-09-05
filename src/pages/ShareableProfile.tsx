import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Mail, Phone, Globe, Github, Linkedin, Download, Star, Calendar, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ShareableProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      // First get the user by username from profiles table
      const { data: userProfile, error: profileError } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("username", username)
        .single();

      if (profileError || !userProfile) {
        console.error("Error fetching user profile:", profileError);
        setLoading(false);
        return;
      }

      // Then get the detailed profile from myprofile table
      const { data: detailedProfile, error: detailError } = await supabase
        .from("myprofile")
        .select("*")
        .eq("user_id", userProfile.user_id)
        .single();

      if (detailError) {
        console.error("Error fetching detailed profile:", detailError);
      }

      setProfile(detailedProfile);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary/10 via-background to-primary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="text-center mb-12">
              <Avatar className="w-32 h-32 mx-auto mb-6">
                <AvatarImage src={profile.profile_picture} />
                <AvatarFallback className="text-2xl">
                  {profile.full_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              
              <h1 className="text-4xl font-bold mb-2">{profile.full_name}</h1>
              <p className="text-xl text-primary font-semibold mb-4">{profile.headline}</p>
              
              <div className="flex items-center justify-center gap-4 text-muted-foreground mb-6">
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.contact_email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span>{profile.contact_email}</span>
                  </div>
                )}
                {profile.phone_number && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>{profile.phone_number}</span>
                  </div>
                )}
              </div>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">{profile.bio}</p>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="hero">
                  Hire Me
                </Button>
                <Button variant="outline">
                  Connect
                </Button>
                {profile.resume_url && (
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Resume
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Languages */}
            {profile.languages && profile.languages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.languages.map((language: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Social Links */}
            {profile.social_links && Object.keys(profile.social_links).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Connect With Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profile.social_links.linkedin && (
                      <a href={profile.social_links.linkedin} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </a>
                    )}
                    {profile.social_links.github && (
                      <a href={profile.social_links.github} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                        <Github className="w-4 h-4" />
                        GitHub
                      </a>
                    )}
                    {profile.social_links.website && (
                      <a href={profile.social_links.website} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                        <Globe className="w-4 h-4" />
                        Portfolio Website
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Achievements */}
            {profile.achievements && profile.achievements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {profile.achievements.map((achievement: any, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary" />
                        <span className="text-sm">{achievement.title}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Experience */}
            {profile.work_experience && profile.work_experience.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Work Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {profile.work_experience.map((exp: any, index: number) => (
                      <div key={index} className="border-l-2 border-muted pl-4">
                        <h3 className="font-semibold">{exp.role}</h3>
                        <p className="text-primary font-medium">{exp.company}</p>
                        <p className="text-sm text-muted-foreground mb-2">
                          {exp.duration}
                        </p>
                        <p className="text-sm">{exp.responsibilities}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Education */}
            {profile.education && profile.education.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.education.map((edu: any, index: number) => (
                      <div key={index} className="border-l-2 border-muted pl-4">
                        <h3 className="font-semibold">{edu.degree}</h3>
                        <p className="text-primary font-medium">{edu.institution}</p>
                        <p className="text-sm text-muted-foreground">{edu.year}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Portfolio Projects */}
            {profile.portfolio_projects && profile.portfolio_projects.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {profile.portfolio_projects.map((project: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-2">{project.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                        {project.links && (
                          <div className="flex gap-2">
                            {project.links.github && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={project.links.github}>
                                  <Github className="w-3 h-3" />
                                </a>
                              </Button>
                            )}
                            {project.links.demo && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={project.links.demo}>
                                  <Globe className="w-3 h-3" />
                                </a>
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Testimonials */}
            {profile.testimonials && profile.testimonials.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Reviews & Testimonials</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.testimonials.map((testimonial: any, index: number) => (
                      <div key={index} className="border-l-2 border-primary pl-4">
                        <p className="text-sm mb-2">"{testimonial.message}"</p>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{testimonial.author}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < testimonial.rating
                                    ? "fill-primary text-primary"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareableProfile;