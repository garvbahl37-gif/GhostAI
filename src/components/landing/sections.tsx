"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Globe, Users, Activity, DollarSign, LifeBuoy, TrendingDown,
  UserMinus, Swords, Clock, FileText, X, Check, ArrowRight, ArrowUpRight,
} from "lucide-react";
import { AGENTS } from "@/components/war-room/agent-meta";

const HEAD = { fontFamily: "var(--font-heading)" };

function reveal(i = 0) {
  return {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.5, delay: i * 0.06 },
  };
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400">{children}</p>;
}

/* ── This is not a chatbot ───────────────────────────────────────────────── */
export function Differentiator() {
  const bad = ["Wait for customers to ask", "Answer after the damage is done", "See one conversation at a time", "Can't predict churn or lost revenue"];
  const good = ["Becomes hundreds of customers", "Finds problems before launch", "Simulates your whole market at once", "Predicts churn, conversion & revenue leaks"];
  return (
    <section className="container py-28">
      <motion.div {...reveal()} className="mx-auto max-w-2xl text-center">
        <Eyebrow>The difference</Eyebrow>
        <h2 className="mt-4 text-4xl tracking-tight text-slate-900 sm:text-5xl" style={HEAD}>
          This is not a chatbot.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-slate-500">
          Every other AI tool waits for a customer to complain, then answers. GhostCustomer does the opposite — it
          becomes the customer and finds the problem first.
        </p>
      </motion.div>

      <motion.div {...reveal(1)} className="mx-auto mt-14 grid max-w-3xl gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2">
        <div className="bg-white p-7">
          <p className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-400">
            <X className="h-4 w-4" /> Reactive chatbots
          </p>
          <ul className="space-y-2.5 text-sm text-slate-500">
            {bad.map((t) => (
              <li key={t} className="flex gap-2.5">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-7">
          <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Check className="h-4 w-4" /> GhostCustomer
          </p>
          <ul className="space-y-2.5 text-sm text-slate-600">
            {good.map((t) => (
              <li key={t} className="flex gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-slate-900" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}

const FEATURES = [
  { icon: Globe, title: "Website Intelligence", desc: "Crawls and understands your site, pricing, FAQs, and trust signals." },
  { icon: Users, title: "Persona Generator", desc: "Creates 50–500 realistic customers across 10 archetypes." },
  { icon: Activity, title: "Customer Swarm", desc: "Each persona independently evaluates and scores your experience." },
  { icon: DollarSign, title: "Sales Agent", desc: "Acts as a buyer and finds unanswered objections and missing info." },
  { icon: LifeBuoy, title: "Support Stress Test", desc: "Throws hard tickets and edge cases at your FAQ and docs." },
  { icon: TrendingDown, title: "Revenue Leak Detector", desc: "Quantifies hidden conversion blockers and their dollar impact." },
  { icon: UserMinus, title: "Churn Prediction", desc: "Forecasts which segments will leave — and exactly why." },
  { icon: Swords, title: "Competitor Arena", desc: "Battles your site vs a rival across every customer segment." },
  { icon: Clock, title: "Pricing Time Machine", desc: "Simulates customer reactions to any price change." },
  { icon: FileText, title: "Executive Report", desc: "Board-ready insights, recommendations, and projected uplift." },
];

export function Features() {
  return (
    <section className="container py-28">
      <motion.div {...reveal()} className="mx-auto max-w-2xl text-center">
        <Eyebrow>Capabilities</Eyebrow>
        <h2 className="mt-4 text-4xl tracking-tight text-slate-900 sm:text-5xl" style={HEAD}>
          Ten ways to find problems first
        </h2>
        <p className="mt-4 text-[17px] text-slate-500">One simulation run powers every analysis below.</p>
      </motion.div>

      <motion.div {...reveal(1)} className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-5">
        {FEATURES.map((f) => (
          <div key={f.title} className="group flex flex-col bg-white p-5 transition-colors duration-200 hover:bg-slate-50/80">
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors duration-200 group-hover:border-slate-900 group-hover:bg-slate-900 group-hover:text-white">
              <f.icon className="h-[18px] w-[18px]" />
            </span>
            <p className="mt-3.5 text-[15px] font-medium leading-snug text-slate-900">{f.title}</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">{f.desc}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

export function AgentsShowcase() {
  return (
    <section className="container py-28">
      <motion.div {...reveal()} className="mx-auto max-w-2xl text-center">
        <Eyebrow>Architecture</Eyebrow>
        <h2 className="mt-4 text-4xl tracking-tight text-slate-900 sm:text-5xl" style={HEAD}>
          A coordinated multi-agent brain
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-slate-500">
          Eight specialized agents — orchestrated with LangGraph — hand off work like a real research team.
        </p>
      </motion.div>

      <div className="mx-auto mt-14 flex max-w-4xl flex-wrap items-center justify-center gap-2.5">
        {AGENTS.map((a, i) => (
          <motion.div key={a.name} {...reveal(i)} className="flex items-center gap-2.5">
            <div className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-2.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: a.color }} />
              <span className="text-sm font-medium text-slate-700">{a.name}</span>
            </div>
            {i < AGENTS.length - 1 && <ArrowRight className="h-4 w-4 text-slate-300 max-md:hidden" />}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const STEPS = [
  "Enter a website URL",
  "AI crawls & analyzes the business",
  "Generates hundreds of customer personas",
  "Runs the customer simulation swarm",
  "Sales & support agents stress-test it",
  "Detects revenue leaks & churn risks",
  "Delivers an executive report",
];

export function HowItWorks() {
  return (
    <section id="how" className="container py-28">
      <motion.div {...reveal()} className="mx-auto max-w-2xl text-center">
        <Eyebrow>The flow</Eyebrow>
        <h2 className="mt-4 text-4xl tracking-tight text-slate-900 sm:text-5xl" style={HEAD}>
          From URL to insight in 7 steps
        </h2>
      </motion.div>

      <div className="mx-auto mt-14 max-w-2xl divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {STEPS.map((step, i) => (
          <motion.div key={step} {...reveal(i)} className="flex items-center gap-5 px-6 py-5 transition-colors hover:bg-slate-50/80">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-900 font-mono text-[13px] font-semibold text-white">
              {i + 1}
            </span>
            <span className="font-medium text-slate-800">{step}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="container py-32">
      <motion.div {...reveal()} className="mx-auto max-w-3xl text-center">
        <Eyebrow>Get started</Eyebrow>
        <h2 className="mt-5 text-4xl tracking-tight text-slate-900 sm:text-6xl" style={HEAD}>
          See your customers before they&apos;re real.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-slate-500">
          Run a full simulation in under a minute. No signup, no API key required — it works on the demo engine out of
          the box.
        </p>
        <div className="mt-9 flex justify-center">
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black"
          >
            Launch the swarm
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
