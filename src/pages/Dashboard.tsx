import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  GraduationCap, 
  FolderOpen, 
  Zap, 
  MessageCircle, 
  DollarSign,
  TrendingUp,
  Users,
  Activity,
  Eye
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobsPosted: 0,
    totalCoursesCreated: 0,
    totalProjectsUploaded: 0,
    totalGigs: 0,
    totalQAPosts: 0,
    totalEarnings: 0
  });

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Fetch jobs posted by user
      const { count: jobsCount } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      // Fetch job applications made by user
      const { count: applicationsCount } = await supabase
        .from('job_applications')
        .select('*', { count: 'exact', head: true })
        .eq('applicant_id', user?.id);

      // Fetch projects uploaded by user
      const { count: projectsCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      // Fetch gigs created by user
      const { count: gigsCount } = await supabase
        .from('gigs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      // Calculate earnings from accepted applications (mock calculation)
      const earnings = (applicationsCount || 0) * 1500; // Mock earning per application

      setStats({
        totalJobsPosted: jobsCount || 0,
        totalCoursesCreated: 0, // Will be implemented when EduTask is built
        totalProjectsUploaded: projectsCount || 0,
        totalGigs: gigsCount || 0,
        totalQAPosts: 0, // Will be implemented when Ask & Teach is built
        totalEarnings: earnings
      });

    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "Error loading dashboard",
        description: "Failed to load dashboard statistics.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Jobs Posted",
      value: stats.totalJobsPosted,
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "WorkZone"
    },
    {
      title: "Total Courses Created",
      value: stats.totalCoursesCreated,
      icon: GraduationCap,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "EduTask"
    },
    {
      title: "Total Projects Uploaded",
      value: stats.totalProjectsUploaded,
      icon: FolderOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "ProjectHub"
    },
    {
      title: "Total Gigs",
      value: stats.totalGigs,
      icon: Zap,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "BubbleGigs + SkillExchange"
    },
    {
      title: "Total Q&A Posts",
      value: stats.totalQAPosts,
      icon: MessageCircle,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      description: "Ask & Teach"
    },
    {
      title: "Total Earnings",
      value: `₹${stats.totalEarnings}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      description: "Platform revenue + user earnings"
    }
  ];

  const activityData = [
    { label: "Profile Views", value: 0, icon: Eye },
    { label: "User Growth", value: "+12%", icon: Users },
    { label: "Engagement", value: 0, icon: Activity },
    { label: "Revenue Trend", value: "+0%", icon: TrendingUp }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">
            Track your activity across all FinitiixHub modules
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <Badge variant="outline">{item.value}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Module Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Module-wise Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">WorkZone</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-sm text-muted-foreground">60%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">EduTask</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <span className="text-sm text-muted-foreground">0%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">ProjectHub</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <span className="text-sm text-muted-foreground">0%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">BubbleGigs</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <span className="text-sm text-muted-foreground">0%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity to display</p>
              <p className="text-sm">Start by posting a job or creating content!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;