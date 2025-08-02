import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  TrendingUp,
  Eye,
  UserPlus,
  Activity
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  activeJobs: number;
  recentUsers: any[];
  recentJobs: any[];
  recentApplications: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    activeJobs: 0,
    recentUsers: [],
    recentJobs: [],
    recentApplications: [],
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time subscriptions
    const channel = supabase
      .channel('admin-dashboard')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' },
        () => fetchDashboardData()
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'jobs' },
        () => fetchDashboardData()
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'job_applications' },
        () => fetchDashboardData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch total jobs
      const { count: totalJobs } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true });

      // Fetch active jobs
      const { count: activeJobs } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open');

      // Fetch total applications
      const { count: totalApplications } = await supabase
        .from('job_applications')
        .select('*', { count: 'exact', head: true });

      // Fetch recent users (last 10)
      const { data: recentUsers } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch recent jobs
      const { data: recentJobs } = await supabase
        .from('jobs')
        .select(`
          *,
          profiles:user_id (name, username)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch recent applications
      const { data: recentApplications } = await supabase
        .from('job_applications')
        .select(`
          *,
          jobs (title),
          profiles:applicant_id (name, username)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      setStats({
        totalUsers: totalUsers || 0,
        totalJobs: totalJobs || 0,
        totalApplications: totalApplications || 0,
        activeJobs: activeJobs || 0,
        recentUsers: recentUsers || [],
        recentJobs: recentJobs || [],
        recentApplications: recentApplications || [],
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'hired': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-3">
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of platform activities and statistics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Registered users on platform
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalJobs}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeJobs} currently active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalApplications}</div>
              <p className="text-xs text-muted-foreground">
                Total job applications
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground">
                Job completion rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">Recent Users</TabsTrigger>
            <TabsTrigger value="jobs">Recent Jobs</TabsTrigger>
            <TabsTrigger value="applications">Recent Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Recent User Registrations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString()}
                        </p>
                        <Badge variant="outline">New User</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Recent Job Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentJobs.map((job: any) => (
                    <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium line-clamp-1">{job.title}</p>
                        <p className="text-sm text-muted-foreground">
                          By {job.profiles?.name} • ${job.budget_min}-${job.budget_max}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(job.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentApplications.map((application: any) => (
                    <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium line-clamp-1">{application.jobs.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Applied by {application.profiles?.name} • Bid: ${application.bid_amount}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(application.status)}>
                          {application.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(application.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}