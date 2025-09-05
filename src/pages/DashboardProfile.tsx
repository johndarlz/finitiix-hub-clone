import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  MapPin, 
  Link as LinkIcon, 
  Mail, 
  Phone, 
  Edit3, 
  Save, 
  X,
  Github,
  Linkedin,
  Globe,
  Download,
  Star,
  Briefcase,
  Award,
  Video,
  Users,
  MessageSquare
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

const DashboardProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    location: "",
    phone_number: "",
    skills: "",
    experience: "",
    portfolio_url: "",
    avatar_url: ""
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          name: data.name || "",
          username: data.username || "",
          bio: data.bio || "",
          location: data.location || "",
          phone_number: data.phone_number || "",
          skills: data.skills || "",
          experience: data.experience || "",
          portfolio_url: data.portfolio_url || "",
          avatar_url: data.avatar_url || ""
        });
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...formData
        });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });

      setEditMode(false);
      fetchProfile();
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading profile...</p>
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
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">Manage your professional profile</p>
          </div>
          <div className="flex gap-2">
            {editMode ? (
              <>
                <Button variant="outline" onClick={() => setEditMode(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button onClick={() => setEditMode(true)}>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Header */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row items-start gap-6">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={formData.avatar_url} />
                      <AvatarFallback className="text-2xl">
                        {getInitials(formData.name || user?.email || 'U')}
                      </AvatarFallback>
                    </Avatar>
                    {editMode && (
                      <Button variant="outline" size="sm">
                        Change Photo
                      </Button>
                    )}
                  </div>

                  <div className="flex-1 space-y-4">
                    {editMode ? (
                      <div className="grid gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            placeholder="@username"
                          />
                        </div>
                        <div>
                          <Label htmlFor="bio">Tagline / Short Bio</Label>
                          <Textarea
                            id="bio"
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                            placeholder="Full Stack Developer | AI Enthusiast | Freelancer"
                            rows={2}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              value={formData.location}
                              onChange={(e) => setFormData({...formData, location: e.target.value})}
                              placeholder="Hyderabad, India"
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              value={formData.phone_number}
                              onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                              placeholder="+91 9876543210"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h2 className="text-2xl font-bold">{formData.name || "Add your name"}</h2>
                        <p className="text-primary">@{formData.username || user?.email?.split('@')[0]}</p>
                        <p className="text-muted-foreground mt-2">{formData.bio || "Add a tagline to describe yourself"}</p>
                        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                          {formData.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{formData.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            <span>{user?.email}</span>
                          </div>
                          {formData.phone_number && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              <span>{formData.phone_number}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button variant="hero" size="sm">
                            Hire Me
                          </Button>
                          <Button variant="outline" size="sm">
                            Message
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Resume
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Social & Professional Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5" />
                Social & Professional Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {editMode ? (
                <div className="space-y-3">
                  <Input placeholder="GitHub Profile URL" />
                  <Input placeholder="LinkedIn Profile URL" />
                  <Input placeholder="Portfolio Website URL" />
                  <Input 
                    placeholder="Portfolio URL"
                    value={formData.portfolio_url}
                    onChange={(e) => setFormData({...formData, portfolio_url: e.target.value})}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-lg border">
                    <Github className="w-5 h-5" />
                    <span className="text-sm text-muted-foreground">Add GitHub profile</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg border">
                    <Linkedin className="w-5 h-5" />
                    <span className="text-sm text-muted-foreground">Add LinkedIn profile</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg border">
                    <Globe className="w-5 h-5" />
                    <span className="text-sm text-muted-foreground">Add portfolio website</span>
                  </div>
                  {formData.portfolio_url && (
                    <div className="flex items-center gap-3 p-2 rounded-lg border">
                      <Globe className="w-5 h-5" />
                      <a href={formData.portfolio_url} target="_blank" rel="noopener noreferrer" 
                         className="text-sm text-primary hover:underline">
                        {formData.portfolio_url}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills & Experience */}
          <Card>
            <CardHeader>
              <CardTitle>Skills & Experience</CardTitle>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="skills">Skills</Label>
                    <Textarea
                      id="skills"
                      value={formData.skills}
                      onChange={(e) => setFormData({...formData, skills: e.target.value})}
                      placeholder="React, Node.js, Python, UI/UX Design..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Experience</Label>
                    <Textarea
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => setFormData({...formData, experience: e.target.value})}
                      placeholder="Describe your professional experience..."
                      rows={4}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Skills</h4>
                    {formData.skills ? (
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.split(',').map((skill, index) => (
                          <Badge key={index} variant="secondary">{skill.trim()}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Add your skills</p>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Experience</h4>
                    <p className="text-sm text-muted-foreground">
                      {formData.experience || "Add your professional experience"}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Achievements from FinitiixHub */}
          <Card>
            <CardHeader>
              <CardTitle>FinitiixHub Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 mt-0.5 text-blue-600" />
                  <div>
                    <h4 className="font-medium">WorkZone</h4>
                    <p className="text-sm text-muted-foreground">0 jobs completed • ₹0 earned</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 mt-0.5 text-green-600" />
                  <div>
                    <h4 className="font-medium">EduTask</h4>
                    <p className="text-sm text-muted-foreground">0 courses completed • 0 certificates</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Video className="w-5 h-5 mt-0.5 text-orange-600" />
                  <div>
                    <h4 className="font-medium">BubbleGigs</h4>
                    <p className="text-sm text-muted-foreground">0 video pitches • 0 views</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 mt-0.5 text-purple-600" />
                  <div>
                    <h4 className="font-medium">SkillExchange</h4>
                    <p className="text-sm text-muted-foreground">0 collaborations completed</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 mt-0.5 text-indigo-600" />
                  <div>
                    <h4 className="font-medium">Ask & Teach</h4>
                    <p className="text-sm text-muted-foreground">0 questions answered • 0 students mentored</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Badges & Reviews */}
          <div className="lg:col-span-3 grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Badges & Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No badges earned yet</p>
                  <p className="text-sm">Complete jobs and projects to earn badges!</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reviews & Testimonials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No reviews yet</p>
                  <p className="text-sm">Complete your first job to receive reviews!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardProfile;