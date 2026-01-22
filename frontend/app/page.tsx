import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BentoGrid from "@/components/BentoGrid";
import SaasGallerySection from "@/components/SaasGallerySection";
import PlaneStatusDashboard from "@/components/PlaneStatusDashboard";
import PartnersSection from "@/components/PartnersSection";
import PricingSection from "@/components/PricingSection";
import AboutSection from "@/components/AboutSection";
import AICurator from "@/components/AICurator";
import FloatingNotice from "@/components/FloatingNotice";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <HeroSection />
        <BentoGrid />
        <SaasGallerySection />
        <PlaneStatusDashboard />
        <PartnersSection />
        <PricingSection />
        <AboutSection />
        <AICurator />
      </main>
      <FloatingNotice />
    </>
  );
}
