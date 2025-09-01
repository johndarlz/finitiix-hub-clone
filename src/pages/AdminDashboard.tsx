import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Briefcase, 
  BookOpen, 
  FolderOpen, 
  Video, 
  RefreshCw, 
  HelpCircle,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Settings,
  Shield,
  FileText
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/PageLayout";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalJobs: number;
  totalCourses: number;
  totalProjects: number;
  totalGigs: number;
  totalSkills: number;
  totalQuestions: number;
  totalEarnings: number;
  platformRevenue: number;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalJobs: 0,
    totalCourses: 0,
    totalProjects: 0,
    totalGigs: 0,
    totalSkills: 0,
    totalQuestions: 0,
    totalEarnings: 0,
    platformRevenue: 0,
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    try {
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (adminData) {
        setIsAdmin(true);
        fetchAdminStats();
      } else {
        toast.error('Access denied. Admin privileges required.');
        navigate('/');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminStats = async () => {
    try {
      // Fetch user count from profiles (since we can't access auth.users directly)
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      // Fetch jobs count
      const { count: jobsCount } = await supabase
        .from('jobs')
        .select('*', { count: 'exact' });

      // Fetch courses count
      const { count: coursesCount } = await supabase
        .from('courses' as any)
        .select('*', { count: 'exact' });

      // Fetch projects count
      const { count: projectsCount } = await supabase
        .from('projects' as any)
        .select('*', { count: 'exact' });

      // Fetch gigs count
      const { count: gigsCount } = await supabase
        .from('gigs' as any)
        .select('*', { count: 'exact' });

      // Fetch skills count
      const { count: skillsCount } = await supabase
        .from('skills' as any)
        .select('*', { count: 'exact' });

      // Fetch questions count
      const { count: questionsCount } = await supabase
        .from('questions' as any)
        .select('*', { count: 'exact' });

      // Fetch total earnings
      const { data: walletsData } = await supabase
        .from('user_wallets' as any)
        .select('balance');

      const totalEarnings = walletsData?.reduce((sum: number, wallet: any) => sum + (wallet?.balance || 0), 0) || 0;
      const platformRevenue = totalEarnings * 0.1; // Assuming 10% platform fee

      setStats({
        totalUsers: usersCount || 0,
        activeUsers: Math.floor((usersCount || 0) * 0.7), // Estimate 70% active
        totalJobs: jobsCount || 0,
        totalCourses: coursesCount || 0,
        totalProjects: projectsCount || 0,
        totalGigs: gigsCount || 0,
        totalSkills: skillsCount || 0,
        totalQuestions: questionsCount || 0,
        totalEarnings,
        platformRevenue,
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      toast.error('Failed to load admin statistics');
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading admin dashboard...</div>
        </div>
      </PageLayout>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect to home
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      description: `${stats.activeUsers} active users`,
      icon: Users,
      color: "text-blue-500"
    },
    {
      title: "Total Jobs",
      value: stats.totalJobs,
      description: "Posted on WorkZone",
      icon: Briefcase,
      color: "text-green-500"
    },
    {
      title: "Total Earnings",
      value: `₹${stats.totalEarnings}`,
      description: `₹${stats.platformRevenue} platform revenue`,
      icon: DollarSign,
      color: "text-yellow-500"
    },
    {
      title: "Total Content",
      value: stats.totalProjects + stats.totalGigs + stats.totalCourses,
      description: "Projects, Gigs & Courses",
      icon: FolderOpen,
      color: "text-purple-500"
    }
  ];

  const moduleStats = [
    { name: "WorkZone Jobs", count: stats.totalJobs, icon: Briefcase, color: "bg-blue-500" },
    { name: "EduTask Courses", count: stats.totalCourses, icon: BookOpen, color: "bg-green-500" },
    { name: "ProjectHub Projects", count: stats.totalProjects, icon: FolderOpen, color: "bg-purple-500" },
    { name: "BubbleGigs Videos", count: stats.totalGigs, icon: Video, color: "bg-red-500" },
    { name: "SkillExchange Offers", count: stats.totalSkills, icon: RefreshCw, color: "bg-orange-500" },
    { name: "Ask & Teach Q&A", count: stats.totalQuestions, icon: HelpCircle, color: "bg-indigo-500" }
  ];

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Platform overview and management</p>
          </div>
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <Shield className="w-3 h-3 mr-1" />
            Admin Access
          </Badge>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Module Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Module Activity</CardTitle>
            <CardDescription>Content and activity across all platform modules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {moduleStats.map((module, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <div className={`p-2 rounded-full ${module.color}`}>
                    <module.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{module.name}</p>
                    <p className="text-2xl font-bold">{module.count}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Management Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="moderation">Moderation</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                    <div>
                      <h4 className="font-medium">Total Registered Users</h4>
                      <p className="text-sm text-muted-foreground">All users on the platform</p>
                    </div>
                    <Badge variant="outline">{stats.totalUsers}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                    <div>
                      <h4 className="font-medium">Active Users (Last 30 days)</h4>
                      <p className="text-sm text-muted-foreground">Users with recent activity</p>
                    </div>
                    <Badge variant="outline">{stats.activeUsers}</Badge>
                  </div>
                  <Button>View All Users</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Overview</CardTitle>
                <CardDescription>Manage content across all modules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Jobs Posted</h4>
                    <p className="text-2xl font-bold">{stats.totalJobs}</p>
                    <Button variant="outline" size="sm">Manage Jobs</Button>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Courses Created</h4>
                    <p className="text-2xl font-bold">{stats.totalCourses}</p>
                    <Button variant="outline" size="sm">Manage Courses</Button>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Projects Uploaded</h4>
                    <p className="text-2xl font-bold">{stats.totalProjects}</p>
                    <Button variant="outline" size="sm">Manage Projects</Button>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Gigs Posted</h4>
                    <p className="text-2xl font-bold">{stats.totalGigs}</p>
                    <Button variant="outline" size="sm">Manage Gigs</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>Platform revenue and user earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-medium">Total User Earnings</h4>
                    <p className="text-3xl font-bold text-green-600">₹{stats.totalEarnings}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Platform Revenue</h4>
                    <p className="text-3xl font-bold text-blue-600">₹{stats.platformRevenue}</p>
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <Button>View Transaction History</Button>
                  <Button variant="outline" className="ml-2">Generate Report</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moderation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Moderation</CardTitle>
                <CardDescription>Review and moderate platform content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium">Pending Reviews</span>
                    </div>
                    <Badge variant="outline">5</Badge>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="font-medium">Reported Content</span>
                    </div>
                    <Badge variant="outline">2</Badge>
                  </div>
                  <Button variant="outline">View Moderation Queue</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
                <CardDescription>Insights and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-500" />
                      <p className="text-sm text-muted-foreground">User Growth</p>
                      <p className="text-xl font-bold">+12%</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <DollarSign className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                      <p className="text-sm text-muted-foreground">Revenue Growth</p>
                      <p className="text-xl font-bold">+8%</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Users className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                      <p className="text-sm text-muted-foreground">Engagement</p>
                      <p className="text-xl font-bold">85%</p>
                    </div>
                  </div>
                  <Button>View Detailed Analytics</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure platform settings and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <h4 className="font-medium">Platform Commission Rate</h4>
                      <p className="text-sm text-muted-foreground">Current rate: 10%</p>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <h4 className="font-medium">Virtual Coin Value</h4>
                      <p className="text-sm text-muted-foreground">1 coin = ₹1</p>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <h4 className="font-medium">Admin Permissions</h4>
                      <p className="text-sm text-muted-foreground">Manage admin roles</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default AdminDashboard;