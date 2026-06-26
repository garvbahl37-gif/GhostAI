import { MainframeHero } from "@/components/landing/mainframe-hero";
import { TrustSection } from "@/components/landing/trust-section";
import {
  Differentiator,
  Features,
  AgentsShowcase,
  HowItWorks,
  FinalCTA,
} from "@/components/landing/sections";

export default function LandingPage() {
  return (
    <>
      <MainframeHero />

      {/* Landing content below the hero — opaque so it covers the fixed video on scroll */}
      <div className="relative z-10 bg-[#fbfbfd]">
        <TrustSection />
        <Differentiator />
        <Features />
        <AgentsShowcase />
        <HowItWorks />
        <FinalCTA />
        <footer className="border-t border-slate-200 py-8 text-center text-xs text-slate-400">
          Ghost Customer AI · Multi-agent customer simulation · Built with Next.js, LangGraph &amp; Gemini
        </footer>
      </div>
    </>
  );
}
