import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import WorkZone from "./pages/WorkZone";
import EduTask from "./pages/EduTask";
import ProjectHub from "./pages/ProjectHub";
import BubbleGigs from "./pages/BubbleGigs";
import SkillExchange from "./pages/SkillExchange";
import AskTeach from "./pages/AskTeach";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/workzone" element={<WorkZone />} />
            <Route path="/edutask" element={<EduTask />} />
            <Route path="/projecthub" element={<ProjectHub />} />
            <Route path="/bubblegigs" element={<BubbleGigs />} />
            <Route path="/skillexchange" element={<SkillExchange />} />
            <Route path="/ask-teach" element={<AskTeach />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
