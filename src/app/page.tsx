import { Hero } from "@/components/landing/hero";
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
    <>
      <SafeMount>
        <LandingEffects />
      </SafeMount>
      <Hero />
      <Differentiator />
      <Features />
      <AgentsShowcase />
      <HowItWorks />
      <FinalCTA />
      <footer className="border-t border-white/5 py-8 text-center text-xs text-muted-foreground">
        Ghost Customer AI · Multi-agent customer simulation · Built with Next.js, LangGraph & Gemini
      </footer>
    </>
  );
}
