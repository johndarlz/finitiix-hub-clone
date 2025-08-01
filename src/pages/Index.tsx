import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ModulesSection from "@/components/ModulesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import SuccessStoriesSection from "@/components/SuccessStoriesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ModulesSection />
      <HowItWorksSection />
      <SuccessStoriesSection />
      <Footer />
    </div>
  );
};

export default Index;