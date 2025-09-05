import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  Bell, 
  Shield, 
  Eye, 
  Globe, 
  Smartphone,
  Mail,
  Lock,
  Trash2
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

const DashboardSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    profileVisibility: true,
    showOnlineStatus: true,
    twoFactorAuth: false,
    marketingEmails: false
  });

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    toast({
      title: "Settings updated",
      description: "Your preferences have been saved."
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and privacy</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Account Settings */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" value={user?.email || ""} disabled />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="Add phone number" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input id="timezone" value="Asia/Kolkata" />
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Input id="language" value="English" />
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive job updates via email</p>
                  </div>
                  <Switch 
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get instant notifications on your device</p>
                  </div>
                  <Switch 
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive promotional offers and updates</p>
                  </div>
                  <Switch 
                    checked={settings.marketingEmails}
                    onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Privacy Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Profile Visibility</Label>
                    <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
                  </div>
                  <Switch 
                    checked={settings.profileVisibility}
                    onCheckedChange={(checked) => handleSettingChange('profileVisibility', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Online Status</Label>
                    <p className="text-sm text-muted-foreground">Let others see when you're online</p>
                  </div>
                  <Switch 
                    checked={settings.showOnlineStatus}
                    onCheckedChange={(checked) => handleSettingChange('showOnlineStatus', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security & Danger Zone */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-xs text-muted-foreground">Add extra security to your account</p>
                  </div>
                  <Switch 
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                  />
                </div>
                <Separator />
                <Button variant="outline" className="w-full">
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                <Button variant="outline" className="w-full">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Manage Sessions
                </Button>
              </CardContent>
            </Card>

            {/* Connected Apps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Connected Apps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4 text-muted-foreground">
                  <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No connected apps</p>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Trash2 className="w-5 h-5" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                  Deactivate Account
                </Button>
                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
                <p className="text-xs text-muted-foreground">
                  These actions cannot be undone. Please be careful.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardSettings;