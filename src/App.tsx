import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import WorkZone from "./pages/WorkZone";
import PostJob from "./pages/PostJob";
import ApplyJob from "./pages/ApplyJob";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import DashboardProfile from "./pages/DashboardProfile";
import DashboardWorkspaceNew from "./pages/DashboardWorkspaceNew";
import DashboardWallet from "./pages/DashboardWallet";
import DashboardSettings from "./pages/DashboardSettings";
import UploadProject from "./pages/UploadProject";
import ShareableProfile from "./pages/ShareableProfile";
import EduTask from "./pages/EduTask";
import ProjectHub from "./pages/ProjectHub";
import BubbleGigs from "./pages/BubbleGigs";
import CreateGig from "./pages/CreateGig";
import SkillExchange from "./pages/SkillExchange";
import AskTeach from "./pages/AskTeach";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/workzone" element={<WorkZone />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/apply-job/:jobId" element={<ApplyJob />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/profile" element={<DashboardProfile />} />
            <Route path="/dashboard/workspace" element={<DashboardWorkspaceNew />} />
        <Route path="/dashboard/wallet" element={<DashboardWallet />} />
        <Route path="/dashboard/settings" element={<DashboardSettings />} />
        <Route path="/upload-project" element={<UploadProject />} />
        <Route path="/profile/:username" element={<ShareableProfile />} />
            <Route path="/edutask" element={<EduTask />} />
            <Route path="/projecthub" element={<ProjectHub />} />
            <Route path="/bubble-gigs" element={<BubbleGigs />} />
            <Route path="/create-gig" element={<CreateGig />} />
            <Route path="/skill-exchange" element={<SkillExchange />} />
            <Route path="/ask-teach" element={<AskTeach />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/about" element={<About />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
