import { Hero } from "@/components/landing/hero";
import { TrustSection } from "@/components/landing/trust-section";
import {
  Differentiator,
  Features,
  AgentsShowcase,
  HowItWorks,
  FinalCTA,
} from "@/components/landing/sections";
import { LandingEffects } from "@/components/landing/landing-effects";
import { SafeMount } from "@/components/shared/safe-mount";

export default function LandingPage() {
  return (
    <div className="landing-page-theme">
      <SafeMount>
        <LandingEffects />
      </SafeMount>
      <Hero />
      <TrustSection />
      <Differentiator />
      <Features />
      <AgentsShowcase />
      <HowItWorks />
      <FinalCTA />
      <footer className="border-t border-slate-200/80 py-8 text-center text-xs text-slate-400">
        Ghost Customer AI · Multi-agent customer simulation · Built with Next.js, LangGraph &amp; Gemini
      </footer>
    </div>
  );
}
