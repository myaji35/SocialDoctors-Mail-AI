import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BentoGrid from "@/components/BentoGrid";
import ServicesSection from "@/components/ServicesSection";
import SaasGallerySection from "@/components/SaasGallerySection";
import PlaneStatusDashboard from "@/components/PlaneStatusDashboard";
import PartnersSection from "@/components/PartnersSection";
import PricingSection from "@/components/PricingSection";
import AboutSection from "@/components/AboutSection";
import AICurator from "@/components/AICurator";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <HeroSection />
        <BentoGrid />
        <ServicesSection />
        <SaasGallerySection />
        <PlaneStatusDashboard />
        <PartnersSection />
        <PricingSection />
        <AboutSection />
        <AICurator />
      </main>
    </>
  );
}
