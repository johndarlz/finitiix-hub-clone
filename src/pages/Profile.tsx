import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Briefcase, 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Edit
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [postedJobs, setPostedJobs] = useState<any[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [editMode, setEditMode] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    phone_number: "",
    avatar_url: "",
    bio: "",
    location: "",
    skills: "",
    experience: "",
    portfolio_url: ""
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchPostedJobs();
      fetchAppliedJobs();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (data) {
        setProfile(data);
        setProfileData({
          name: data.name || "",
          username: data.username || "",
          phone_number: data.phone_number || "",
          avatar_url: data.avatar_url || "",
          bio: data.bio || "",
          location: data.location || "",
          skills: data.skills || "",
          experience: data.experience || "",
          portfolio_url: data.portfolio_url || ""
        });
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchPostedJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          job_applications(count)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (data) setPostedJobs(data);
    } catch (error: any) {
      console.error("Error fetching posted jobs:", error);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          jobs(title, budget, category, status)
        `)
        .eq('applicant_id', user?.id)
        .order('created_at', { ascending: false });

      if (data) setAppliedJobs(data);
    } catch (error: any) {
      console.error("Error fetching applied jobs:", error);
    }
  };

  const updateProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...profileData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setProfile({ ...profile, ...profileData });
      setEditMode(false);
      
      toast({
        title: "Profile updated successfully!",
        description: "Your profile information has been saved."
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'accepted': return 'bg-blue-500';
      case 'rejected': return 'bg-red-500';
      case 'completed': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'accepted':
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (!user) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p>Please sign in to view your profile.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profileData.avatar_url} />
                    <AvatarFallback className="text-2xl">
                      {profileData.name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-3xl font-bold">{profileData.name || 'Your Name'}</h1>
                    <p className="text-muted-foreground text-lg">@{profileData.username || 'username'}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      {user.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                      )}
                      {profileData.phone_number && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {profileData.phone_number}
                        </div>
                      )}
                      {profileData.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {profileData.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setEditMode(!editMode)}
                  className="flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  {editMode ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
            </CardHeader>
            {profileData.bio && (
              <CardContent>
                <p className="text-muted-foreground">{profileData.bio}</p>
              </CardContent>
            )}
          </Card>

          {/* Edit Profile Form */}
          {editMode && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={profileData.username}
                      onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone_number}
                      onChange={(e) => setProfileData({...profileData, phone_number: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="skills">Skills (comma separated)</Label>
                  <Textarea
                    id="skills"
                    value={profileData.skills}
                    onChange={(e) => setProfileData({...profileData, skills: e.target.value})}
                    placeholder="React, Node.js, Python, Design..."
                  />
                </div>
                <div>
                  <Label htmlFor="portfolio">Portfolio URL</Label>
                  <Input
                    id="portfolio"
                    value={profileData.portfolio_url}
                    onChange={(e) => setProfileData({...profileData, portfolio_url: e.target.value})}
                    placeholder="https://yourportfolio.com"
                  />
                </div>
                <Button onClick={updateProfile} disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Workspace Tabs */}
          <Tabs defaultValue="workspace" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="workspace">My Workspace</TabsTrigger>
              <TabsTrigger value="workzone">WorkZone Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="workspace">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Quick Stats */}
                <Card>
                  <CardContent className="p-6 text-center">
                    <Briefcase className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{postedJobs.length}</div>
                    <div className="text-sm text-muted-foreground">Jobs Posted</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <User className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold">{appliedJobs.length}</div>
                    <div className="text-sm text-muted-foreground">Applications</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold">
                      {appliedJobs.filter(app => app.status === 'accepted').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Accepted</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <DollarSign className="w-8 h-8 mx-auto mb-2 text-success" />
                    <div className="text-2xl font-bold">₹0</div>
                    <div className="text-sm text-muted-foreground">Earnings</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="workzone">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Posted Jobs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      Posted Jobs ({postedJobs.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {postedJobs.length > 0 ? (
                      postedJobs.map((job: any) => (
                        <div key={job.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold">{job.title}</h4>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(job.status)}`}></div>
                              <span className="text-sm capitalize">{job.status}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>₹{job.budget}</span>
                            <span>{job.category}</span>
                            <span>{job.job_applications?.[0]?.count || 0} applications</span>
                          </div>
                          <div className="mt-2">
                            <Badge variant="outline">{job.job_type}</Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-8">No jobs posted yet.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Applied Jobs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Applied Jobs ({appliedJobs.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {appliedJobs.length > 0 ? (
                      appliedJobs.map((application: any) => (
                        <div key={application.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold">{application.jobs?.title}</h4>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(application.status)}
                              <span className="text-sm capitalize">{application.status}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>₹{application.expected_budget}</span>
                            <span>{application.jobs?.category}</span>
                            <span>Applied {new Date(application.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="mt-2">
                            <Badge variant="outline">{application.availability}</Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-8">No applications submitted yet.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
};

export default Profile;