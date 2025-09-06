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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  MessageSquare,
  Calendar,
  Upload,
  Plus,
  Trash2,
  Share,
  Copy
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
    // Basic Information
    full_name: "",
    profile_picture: "",
    gender: "",
    date_of_birth: "",
    contact_email: "",
    phone_number: "",
    location: "",
    
    // Professional Information
    headline: "",
    bio: "",
    skills: [],
    years_experience: 0,
    languages: [],
    
    // Education
    education: [],
    
    // Work Experience
    work_experience: [],
    
    // Projects/Portfolio
    portfolio_projects: [],
    
    // Resume/CV Upload
    resume_url: "",
    
    // Certifications
    certifications: [],
    
    // Social/Portfolio Links
    social_links: {},
    
    // Additional Notes
    additional_notes: "",
    
    // FinitiixHub achievements
    achievements: [],
    badges: [],
    testimonials: []
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
        .from('myprofile')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || "",
          profile_picture: data.profile_picture || "",
          gender: data.gender || "",
          date_of_birth: data.date_of_birth || "",
          contact_email: data.contact_email || user?.email || "",
          phone_number: data.phone_number || "",
          location: data.location || "",
          headline: data.headline || "",
          bio: data.bio || "",
          skills: Array.isArray(data.skills) ? data.skills : [],
          years_experience: data.years_experience || 0,
          languages: Array.isArray(data.languages) ? data.languages : [],
          education: Array.isArray(data.education) ? data.education : [],
          work_experience: Array.isArray(data.work_experience) ? data.work_experience : [],
          portfolio_projects: Array.isArray(data.portfolio_projects) ? data.portfolio_projects : [],
          resume_url: data.resume_url || "",
          certifications: Array.isArray(data.certifications) ? data.certifications : [],
          social_links: typeof data.social_links === 'object' && data.social_links ? data.social_links : {},
          additional_notes: data.additional_notes || "",
          achievements: Array.isArray(data.achievements) ? data.achievements : [],
          badges: Array.isArray(data.badges) ? data.badges : [],
          testimonials: Array.isArray(data.testimonials) ? data.testimonials : []
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
      // Check if profile exists first
      const { data: existingProfile } = await supabase
        .from('myprofile')
        .select('id')
        .eq('user_id', user.id)
        .single();

      let error;
      if (existingProfile) {
        // Update existing profile
        const result = await supabase
          .from('myprofile')
          .update(formData)
          .eq('user_id', user.id);
        error = result.error;
      } else {
        // Insert new profile
        const result = await supabase
          .from('myprofile')
          .insert({
            user_id: user.id,
            ...formData
          });
        error = result.error;
      }

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });

      setEditMode(false);
      fetchProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleShareProfile = async () => {
    const profileUrl = `${window.location.origin}/profile/${user?.id}`;
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast({
        title: "Profile link copied!",
        description: "Share your profile with others using this link."
      });
    } catch (error) {
      toast({
        title: "Error copying link",
        description: "Please copy the link manually.",
        variant: "destructive"
      });
    }
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { degree: "", institution: "", year: "" }]
    });
  };

  const addWorkExperience = () => {
    setFormData({
      ...formData,
      work_experience: [...formData.work_experience, { 
        company: "", 
        role: "", 
        duration: "", 
        responsibilities: "" 
      }]
    });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      portfolio_projects: [...formData.portfolio_projects, { 
        title: "", 
        description: "", 
        links: [] 
      }]
    });
  };

  const addCertification = () => {
    setFormData({
      ...formData,
      certifications: [...formData.certifications, { 
        name: "", 
        issued_by: "", 
        certificate_url: "" 
      }]
    });
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
            <p className="text-muted-foreground">Manage your professional portfolio</p>
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
              <>
                <Button variant="outline" onClick={handleShareProfile}>
                  <Share className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>
                <Button onClick={() => setEditMode(true)}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Header - Basic Information */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col lg:flex-row items-start gap-6">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={formData.profile_picture} />
                      <AvatarFallback className="text-2xl">
                        {getInitials(formData.full_name || user?.email || 'U')}
                      </AvatarFallback>
                    </Avatar>
                    {editMode && (
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Change Photo
                      </Button>
                    )}
                  </div>

                  <div className="flex-1 space-y-4">
                    {editMode ? (
                      <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input
                              id="full_name"
                              value={formData.full_name}
                              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="gender">Gender (Optional)</Label>
                            <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="date_of_birth">Date of Birth (Optional)</Label>
                            <Input
                              id="date_of_birth"
                              type="date"
                              value={formData.date_of_birth}
                              onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="contact_email">Contact Email</Label>
                            <Input
                              id="contact_email"
                              type="email"
                              value={formData.contact_email}
                              onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="phone_number">Phone Number (Optional)</Label>
                            <Input
                              id="phone_number"
                              value={formData.phone_number}
                              onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                              placeholder="+91 9876543210"
                            />
                          </div>
                          <div>
                            <Label htmlFor="location">Location / City, Country</Label>
                            <Input
                              id="location"
                              value={formData.location}
                              onChange={(e) => setFormData({...formData, location: e.target.value})}
                              placeholder="Hyderabad, India"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h2 className="text-2xl font-bold">{formData.full_name || "Add your name"}</h2>
                        <p className="text-primary">@{user?.email?.split('@')[0]}</p>
                        <p className="text-muted-foreground mt-2">{formData.headline || "Add a professional headline"}</p>
                        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                          {formData.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{formData.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            <span>{formData.contact_email}</span>
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
                          {formData.resume_url && (
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Resume
                            </Button>
                          )}
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Copy className="w-4 h-4" />
                            <span>Share your profile:</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={handleShareProfile}
                              className="h-auto p-1 text-primary hover:text-primary"
                            >
                              Copy Link
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Professional Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {editMode ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="headline">Headline / Tagline</Label>
                    <Input
                      id="headline"
                      value={formData.headline}
                      onChange={(e) => setFormData({...formData, headline: e.target.value})}
                      placeholder="Full-Stack Developer | UI/UX Designer | Data Scientist"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Short Bio / About Me</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      placeholder="Tell us about yourself in 2-5 sentences..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="years_experience">Years of Experience</Label>
                      <Input
                        id="years_experience"
                        type="number"
                        value={formData.years_experience}
                        onChange={(e) => setFormData({...formData, years_experience: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="languages">Languages Known</Label>
                      <Input
                        id="languages"
                        value={Array.isArray(formData.languages) ? formData.languages.join(', ') : ''}
                        onChange={(e) => setFormData({...formData, languages: e.target.value.split(',').map(l => l.trim())})}
                        placeholder="English, Hindi, Telugu"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="skills">Skills</Label>
                    <Textarea
                      id="skills"
                      value={Array.isArray(formData.skills) ? formData.skills.join(', ') : ''}
                      onChange={(e) => setFormData({...formData, skills: e.target.value.split(',').map(s => s.trim())})}
                      placeholder="React, Node.js, Python, UI/UX Design, Machine Learning..."
                      rows={2}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">About</h4>
                    <p className="text-sm text-muted-foreground">
                      {formData.bio || "Add a short bio about yourself"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Skills</h4>
                    {formData.skills && formData.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Add your skills</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-1">Experience</h4>
                      <p className="text-sm text-muted-foreground">{formData.years_experience} years</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Languages</h4>
                      <p className="text-sm text-muted-foreground">
                        {formData.languages && formData.languages.length > 0 
                          ? formData.languages.join(', ') 
                          : "Add languages"
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Social & Professional Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5" />
                Social Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {editMode ? (
                <div className="space-y-3">
                  <Input 
                    placeholder="LinkedIn Profile URL" 
                    value={(formData.social_links as any)?.linkedin || ''}
                    onChange={(e) => setFormData({
                      ...formData, 
                      social_links: {...(formData.social_links as any), linkedin: e.target.value}
                    })}
                  />
                  <Input 
                    placeholder="GitHub Profile URL" 
                    value={(formData.social_links as any)?.github || ''}
                    onChange={(e) => setFormData({
                      ...formData, 
                      social_links: {...(formData.social_links as any), github: e.target.value}
                    })}
                  />
                  <Input 
                    placeholder="Personal Website URL" 
                    value={(formData.social_links as any)?.website || ''}
                    onChange={(e) => setFormData({
                      ...formData, 
                      social_links: {...(formData.social_links as any), website: e.target.value}
                    })}
                  />
                  <Input 
                    placeholder="Behance/Dribbble URL" 
                    value={(formData.social_links as any)?.portfolio || ''}
                    onChange={(e) => setFormData({
                      ...formData, 
                      social_links: {...(formData.social_links as any), portfolio: e.target.value}
                    })}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  {(formData.social_links as any)?.linkedin ? (
                    <div className="flex items-center gap-3 p-2 rounded-lg border">
                      <Linkedin className="w-5 h-5" />
                      <a href={(formData.social_links as any).linkedin} target="_blank" rel="noopener noreferrer" 
                         className="text-sm text-primary hover:underline">
                        LinkedIn Profile
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-2 rounded-lg border">
                      <Linkedin className="w-5 h-5" />
                      <span className="text-sm text-muted-foreground">Add LinkedIn profile</span>
                    </div>
                  )}
                  
                  {(formData.social_links as any)?.github ? (
                    <div className="flex items-center gap-3 p-2 rounded-lg border">
                      <Github className="w-5 h-5" />
                      <a href={(formData.social_links as any).github} target="_blank" rel="noopener noreferrer" 
                         className="text-sm text-primary hover:underline">
                        GitHub Profile
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-2 rounded-lg border">
                      <Github className="w-5 h-5" />
                      <span className="text-sm text-muted-foreground">Add GitHub profile</span>
                    </div>
                  )}
                  
                  {(formData.social_links as any)?.website ? (
                    <div className="flex items-center gap-3 p-2 rounded-lg border">
                      <Globe className="w-5 h-5" />
                      <a href={(formData.social_links as any).website} target="_blank" rel="noopener noreferrer" 
                         className="text-sm text-primary hover:underline">
                        Personal Website
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-2 rounded-lg border">
                      <Globe className="w-5 h-5" />
                      <span className="text-sm text-muted-foreground">Add personal website</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Education</CardTitle>
                {editMode && (
                  <Button variant="outline" size="sm" onClick={addEducation}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Education
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <div className="space-y-4">
                  {formData.education.map((edu, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 p-4 border rounded-lg">
                      <Input
                        placeholder="Degree/Course"
                        value={edu.degree || ''}
                        onChange={(e) => {
                          const newEducation = [...formData.education];
                          newEducation[index] = {...edu, degree: e.target.value};
                          setFormData({...formData, education: newEducation});
                        }}
                      />
                      <Input
                        placeholder="Institution Name"
                        value={edu.institution || ''}
                        onChange={(e) => {
                          const newEducation = [...formData.education];
                          newEducation[index] = {...edu, institution: e.target.value};
                          setFormData({...formData, education: newEducation});
                        }}
                      />
                      <div className="flex gap-2">
                        <Input
                          placeholder="Year"
                          value={edu.year || ''}
                          onChange={(e) => {
                            const newEducation = [...formData.education];
                            newEducation[index] = {...edu, year: e.target.value};
                            setFormData({...formData, education: newEducation});
                          }}
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const newEducation = formData.education.filter((_, i) => i !== index);
                            setFormData({...formData, education: newEducation});
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.education && formData.education.length > 0 ? (
                    formData.education.map((edu, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <h4 className="font-medium">{edu.degree || "Degree"}</h4>
                        <p className="text-sm text-muted-foreground">{edu.institution || "Institution"}</p>
                        <p className="text-xs text-muted-foreground">{edu.year || "Year"}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Add your educational background
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Work Experience */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Work Experience</CardTitle>
                {editMode && (
                  <Button variant="outline" size="sm" onClick={addWorkExperience}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <div className="space-y-4">
                  {formData.work_experience.map((exp, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <Input
                          placeholder="Company/Organization"
                          value={exp.company || ''}
                          onChange={(e) => {
                            const newExp = [...formData.work_experience];
                            newExp[index] = {...exp, company: e.target.value};
                            setFormData({...formData, work_experience: newExp});
                          }}
                        />
                        <Input
                          placeholder="Role/Designation"
                          value={exp.role || ''}
                          onChange={(e) => {
                            const newExp = [...formData.work_experience];
                            newExp[index] = {...exp, role: e.target.value};
                            setFormData({...formData, work_experience: newExp});
                          }}
                        />
                        <div className="flex gap-2">
                          <Input
                            placeholder="Duration (Start - End)"
                            value={exp.duration || ''}
                            onChange={(e) => {
                              const newExp = [...formData.work_experience];
                              newExp[index] = {...exp, duration: e.target.value};
                              setFormData({...formData, work_experience: newExp});
                            }}
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              const newExp = formData.work_experience.filter((_, i) => i !== index);
                              setFormData({...formData, work_experience: newExp});
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        placeholder="Responsibilities/Achievements"
                        value={exp.responsibilities || ''}
                        onChange={(e) => {
                          const newExp = [...formData.work_experience];
                          newExp[index] = {...exp, responsibilities: e.target.value};
                          setFormData({...formData, work_experience: newExp});
                        }}
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.work_experience && formData.work_experience.length > 0 ? (
                    formData.work_experience.map((exp, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{exp.role || "Role"}</h4>
                          <span className="text-sm text-muted-foreground">{exp.duration || "Duration"}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{exp.company || "Company"}</p>
                        <p className="text-sm">{exp.responsibilities || "Responsibilities"}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Add your work experience
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* FinitiixHub Achievements */}
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
          <div className="lg:col-span-2 grid lg:grid-cols-2 gap-6">
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
                  <p className="text-sm">Start completing projects to get reviews!</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resume Upload */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Resume / CV Upload</CardTitle>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <div className="space-y-4">
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      // Handle file upload logic here
                      console.log("File selected:", e.target.files?.[0]);
                    }}
                  />
                  <p className="text-sm text-muted-foreground">
                    Upload your resume (PDF, DOC, DOCX - Max 500KB)
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Download className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No resume uploaded</p>
                  <p className="text-sm">Upload your resume to attract more opportunities</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <Textarea
                  value={formData.additional_notes}
                  onChange={(e) => setFormData({...formData, additional_notes: e.target.value})}
                  placeholder="Anything else you want to showcase or mention..."
                  rows={4}
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {formData.additional_notes || "Add any additional notes about yourself"}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardProfile;