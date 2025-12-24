import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustBar } from "@/components/home/TrustBar";
import { AboutSection } from "@/components/home/AboutSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { MakeInIndiaSection } from "@/components/home/MakeInIndiaSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <TrustBar />
      <AboutSection />
      <ServicesSection />
      <MakeInIndiaSection />
      <HowItWorksSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
