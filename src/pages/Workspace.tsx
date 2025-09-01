import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  Briefcase, 
  BookOpen, 
  FolderOpen, 
  Video, 
  RefreshCw, 
  HelpCircle,
  TrendingUp,
  Clock,
  Star,
  Users,
  Calendar,
  Bell,
  Settings,
  PlusCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/PageLayout";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface DashboardStats {
  jobsCompleted: number;
  earnings: number;
  virtualCoins: number;
  coursesCompleted: number;
  projectsUploaded: number;
  gigsPosted: number;
  skillsOffered: number;
  questionsAnswered: number;
  pendingApplications: number;
  activeJobs: number;
  totalViews: number;
  completionRate: number;
}

const Workspace = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    jobsCompleted: 0,
    earnings: 0,
    virtualCoins: 0,
    coursesCompleted: 0,
    projectsUploaded: 0,
    gigsPosted: 0,
    skillsOffered: 0,
    questionsAnswered: 0,
    pendingApplications: 0,
    activeJobs: 0,
    totalViews: 0,
    completionRate: 0,
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      fetchRecentActivity();
      fetchNotifications();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch wallet data
      const { data: walletData } = await supabase
        .from('user_wallets' as any)
        .select('*')
        .eq('user_id', user?.id)
        .single();

      // Fetch job applications
      const { data: applications } = await supabase
        .from('job_applications' as any)
        .select('*')
        .eq('applicant_id', user?.id);

      // Fetch user jobs
      const { data: jobs } = await supabase
        .from('jobs' as any)
        .select('*')
        .eq('user_id', user?.id);

      // Fetch course enrollments
      const { data: enrollments } = await supabase
        .from('course_enrollments' as any)
        .select('*')
        .eq('student_id', user?.id);

      // Fetch user projects
      const { data: projects } = await supabase
        .from('projects' as any)
        .select('*')
        .eq('user_id', user?.id);

      // Fetch user gigs
      const { data: gigs } = await supabase
        .from('gigs' as any)
        .select('*')
        .eq('user_id', user?.id);

      // Fetch user skills
      const { data: skills } = await supabase
        .from('skills' as any)
        .select('*')
        .eq('user_id', user?.id);

      // Fetch user questions
      const { data: questions } = await supabase
        .from('questions' as any)
        .select('*')
        .eq('user_id', user?.id);

      // Calculate stats with proper type handling
      const totalViews = (projects?.reduce((sum: number, p: any) => sum + (p?.views_count || 0), 0) || 0) +
                        (gigs?.reduce((sum: number, g: any) => sum + (g?.views_count || 0), 0) || 0);

      setStats({
        jobsCompleted: applications?.filter((app: any) => app?.status === 'completed')?.length || 0,
        earnings: (walletData as any)?.balance || 0,
        virtualCoins: (walletData as any)?.virtual_coins || 0,
        coursesCompleted: enrollments?.filter((e: any) => e?.progress === 100)?.length || 0,
        projectsUploaded: projects?.length || 0,
        gigsPosted: gigs?.length || 0,
        skillsOffered: skills?.length || 0,
        questionsAnswered: questions?.filter((q: any) => q?.status === 'answered')?.length || 0,
        pendingApplications: applications?.filter((app: any) => app?.status === 'pending')?.length || 0,
        activeJobs: jobs?.filter((j: any) => j?.status === 'active')?.length || 0,
        totalViews,
        completionRate: applications?.length > 0 ? 
          Math.round((applications.filter((app: any) => app?.status === 'completed').length / applications.length) * 100) : 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    }
  };

  const fetchRecentActivity = async () => {
    // This would fetch recent activities from multiple tables
    // For now, we'll show placeholder data
    setRecentActivity([
      { type: 'job_application', title: 'Applied to Web Development Job', time: '2 hours ago' },
      { type: 'course_enrollment', title: 'Enrolled in React Masterclass', time: '1 day ago' },
      { type: 'project_upload', title: 'Uploaded E-commerce Project', time: '3 days ago' },
    ]);
  };

  const fetchNotifications = async () => {
    // This would fetch notifications
    // For now, we'll show placeholder data
    setNotifications([
      { type: 'payment', message: 'Payment of ₹5000 received', time: '30 mins ago' },
      { type: 'application', message: 'Job application accepted', time: '2 hours ago' },
      { type: 'course', message: 'Course certificate ready', time: '1 day ago' },
    ]);
  };

  const quickActions = [
    { name: 'Post a Job', icon: Briefcase, path: '/workzone/post', color: 'bg-blue-500' },
    { name: 'Start a Course', icon: BookOpen, path: '/edutask/browse', color: 'bg-green-500' },
    { name: 'Upload Project', icon: FolderOpen, path: '/projecthub/upload', color: 'bg-purple-500' },
    { name: 'Create Gig', icon: Video, path: '/bubblegigs/create', color: 'bg-red-500' },
    { name: 'Offer Skill', icon: RefreshCw, path: '/skillexchange/offer', color: 'bg-orange-500' },
    { name: 'Ask Question', icon: HelpCircle, path: '/ask-teach/ask', color: 'bg-indigo-500' },
  ];

  const moduleCards = [
    {
      title: 'WorkZone',
      description: 'Micro Freelance Jobs',
      stats: [`${stats.activeJobs} Active Jobs`, `${stats.pendingApplications} Pending Applications`],
      color: 'border-blue-500',
      icon: Briefcase,
      path: '/workzone'
    },
    {
      title: 'EduTask',
      description: 'Learn & Earn',
      stats: [`${stats.coursesCompleted} Courses Completed`, `${stats.virtualCoins} Virtual Coins`],
      color: 'border-green-500',
      icon: BookOpen,
      path: '/edutask'
    },
    {
      title: 'ProjectHub',
      description: 'Showcase Projects',
      stats: [`${stats.projectsUploaded} Projects Uploaded`, `${Math.floor(stats.totalViews / 2)} Views`],
      color: 'border-purple-500',
      icon: FolderOpen,
      path: '/projecthub'
    },
    {
      title: 'BubbleGigs',
      description: '1-Minute Video Gigs',
      stats: [`${stats.gigsPosted} Gigs Posted`, `${Math.floor(stats.totalViews / 2)} Video Views`],
      color: 'border-red-500',
      icon: Video,
      path: '/bubblegigs'
    },
    {
      title: 'SkillExchange',
      description: 'Barter Your Skills',
      stats: [`${stats.skillsOffered} Skills Offered`, `${stats.virtualCoins} Coins Available`],
      color: 'border-orange-500',
      icon: RefreshCw,
      path: '/skillexchange'
    },
    {
      title: 'Ask & Teach',
      description: 'Learn & Mentor',
      stats: [`${stats.questionsAnswered} Questions Answered`, `₹${stats.earnings / 4} Earned`],
      color: 'border-indigo-500',
      icon: HelpCircle,
      path: '/ask-teach'
    },
  ];

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-xl">
          <h1 className="text-3xl font-bold mb-2">
            Hello, {user?.user_metadata?.name || 'User'} 👋
          </h1>
          <p className="text-muted-foreground">Here's your progress today!</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.earnings}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.virtualCoins} Virtual Coins
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jobs Completed</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.jobsCompleted}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completionRate}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews}</div>
              <p className="text-xs text-muted-foreground">
                Projects & Gigs combined
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.projectsUploaded + stats.gigsPosted}</div>
              <p className="text-xs text-muted-foreground">
                Projects & Gigs
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Fast buttons for frequent actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {quickActions.map((action) => (
                <Link key={action.name} to={action.path}>
                  <Button 
                    variant="outline" 
                    className="h-16 w-full flex-col gap-2 hover:scale-105 transition-transform"
                  >
                    <action.icon className="h-5 w-5" />
                    <span className="text-xs">{action.name}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {moduleCards.map((module) => (
            <Card key={module.title} className={`${module.color} border-l-4`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <module.icon className="h-5 w-5" />
                  {module.title}
                </CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {module.stats.map((stat, index) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      {stat}
                    </div>
                  ))}
                </div>
                <Link to={module.path}>
                  <Button variant="outline" size="sm" className="w-full">
                    Go to {module.title}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progress & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions across all modules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Recent updates and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {notifications.map((notification, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Wallet Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Wallet & Earnings
            </CardTitle>
            <CardDescription>Current balance and transaction history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-2xl font-bold">₹{stats.earnings}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Virtual Coins</p>
                <p className="text-2xl font-bold text-orange-500">{stats.virtualCoins}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Withdrawable</p>
                <p className="text-2xl font-bold text-green-500">₹{Math.floor(stats.earnings * 0.9)}</p>
              </div>
            </div>
            <div className="mt-6">
              <Button>Withdraw Earnings</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Workspace;