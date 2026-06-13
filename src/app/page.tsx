import { Hero } from "@/components/landing/hero";
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
