import { AppHeader } from "@/components/layout/app-header";
import { HeroSection } from "@/components/landing/hero-section";
import { ProblemaSection } from "@/components/landing/problema-section";
import { SolucaoSection } from "@/components/landing/solucao-section";
import { DemoPlayerSection } from "@/components/landing/demo-player-section";
import { PlanosSection } from "@/components/landing/planos-section";
import { FaqSection } from "@/components/landing/faq-section";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <>
      <AppHeader />
      <main className="flex flex-1 flex-col">
        <HeroSection />
        <ProblemaSection />
        <SolucaoSection />
        <DemoPlayerSection />
        <PlanosSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
