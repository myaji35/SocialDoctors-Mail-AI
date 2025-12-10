import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BentoGrid from "@/components/BentoGrid";
import AICurator from "@/components/AICurator";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <HeroSection />
        <BentoGrid />
        <AICurator />
      </main>
    </>
  );
}
