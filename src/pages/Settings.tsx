import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Lock, Globe, Bell, User } from "lucide-react";
import { Link } from "react-router-dom";

interface UserPreferences {
  language: string;
  email_notifications: boolean;
  push_notifications: boolean;
}

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [preferences, setPreferences] = useState<UserPreferences>({
    language: 'en',
    email_notifications: true,
    push_notifications: true,
  });
  const [loading, setLoading] = useState(false);
  const { user, resetPassword } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserPreferences();
    }
  }, [user]);

  const fetchUserPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw error;
      }

      if (data) {
        setPreferences(data);
      }
    } catch (error: any) {
      console.error('Error fetching preferences:', error);
    }
  };

  const updatePreferences = async (newPrefs: Partial<UserPreferences>) => {
    try {
      setLoading(true);
      
      const updatedPrefs = { ...preferences, ...newPrefs };
      
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user?.id,
          ...updatedPrefs,
        });

      if (error) throw error;

      setPreferences(updatedPrefs);
      
      toast({
        title: "Success",
        description: "Preferences updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update preferences",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">Please sign in to access settings.</p>
          <Link to="/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and security</p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Account
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="language" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Language
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user.email || ''}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="language">
            <Card>
              <CardHeader>
                <CardTitle>Language Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="language">Select Language</Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(value) => updatePreferences({ language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                      <SelectItem value="es">Español (Spanish)</SelectItem>
                      <SelectItem value="fr">Français (French)</SelectItem>
                      <SelectItem value="de">Deutsch (German)</SelectItem>
                      <SelectItem value="zh">中文 (Chinese)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Language translation feature is coming soon. 
                    Currently, the interface will remain in English regardless of your selection.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="text-base font-medium">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email updates about your jobs and applications
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={preferences.email_notifications}
                    onCheckedChange={(checked) => 
                      updatePreferences({ email_notifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications" className="text-base font-medium">
                      Push Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive browser notifications for important updates
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={preferences.push_notifications}
                    onCheckedChange={(checked) => 
                      updatePreferences({ push_notifications: checked })
                    }
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">You'll receive notifications for:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• New applications on your jobs</li>
                    <li>• Status updates on your applications</li>
                    <li>• Messages from clients/freelancers</li>
                    <li>• Payment confirmations</li>
                    <li>• Job completion reminders</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}