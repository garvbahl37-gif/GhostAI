"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Globe, Users, Activity, DollarSign, LifeBuoy, TrendingDown,
  UserMinus, Swords, Clock, FileText, X, Check, ArrowRight, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AGENTS } from "@/components/war-room/agent-meta";

function reveal(i = 0) {
  return {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.5, delay: i * 0.06 },
  };
}

export function Differentiator() {
  return (
    <section className="container py-20">
      <motion.div {...reveal()} className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold sm:text-4xl text-slate-900">
          This is <span className="text-rose-500">not</span> a chatbot.
        </h2>
        <p className="mt-3 text-slate-500">
          Every other AI tool waits for a customer to complain, then answers. Ghost Customer AI does the opposite —
          it <span className="text-slate-900 font-medium">becomes the customer</span> and finds the problem first.
        </p>
      </motion.div>

      <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
        <motion.div {...reveal(0)} className="rounded-2xl border border-ghost-rose/20 bg-ghost-rose/5 p-5">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-rose-500">
            <X className="h-4 w-4" /> Reactive chatbots
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {["Wait for customers to ask", "Answer after the damage is done", "See one conversation at a time", "Can't predict churn or lost revenue"].map((t) => (
              <li key={t} className="flex gap-2 text-slate-500">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" /> {t}
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div {...reveal(1)} className="rounded-2xl border border-ghost-emerald/20 bg-ghost-emerald/5 p-5">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <Check className="h-4 w-4" /> Ghost Customer AI
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {["Becomes hundreds of customers", "Finds problems before launch", "Simulates your whole market at once", "Predicts churn, conversion & revenue leaks"].map((t) => (
              <li key={t} className="flex gap-2 text-slate-500">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> {t}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

const FEATURES = [
  { icon: Globe, color: "#d6d6da", title: "Website Intelligence", desc: "Crawls and understands your site, pricing, FAQs, and trust signals." },
  { icon: Users, color: "#8b5cf6", title: "Persona Generator", desc: "Creates 50–500 realistic customers across 10 archetypes." },
  { icon: Activity, color: "#6366f1", title: "Customer Swarm", desc: "Each persona independently evaluates and scores your experience." },
  { icon: DollarSign, color: "#f2f2f4", title: "Sales Agent", desc: "Acts as a buyer and finds unanswered objections and missing info." },
  { icon: LifeBuoy, color: "#a6a6ae", title: "Support Stress Test", desc: "Throws hard tickets and edge cases at your FAQ and docs." },
  { icon: TrendingDown, color: "#6f6f77", title: "Revenue Leak Detector", desc: "Quantifies hidden conversion blockers and their dollar impact." },
  { icon: UserMinus, color: "#f472b6", title: "Churn Prediction", desc: "Forecasts which segments will leave — and exactly why." },
  { icon: Swords, color: "#8a8a92", title: "Competitor Arena", desc: "Battles your site vs a rival across every customer segment." },
  { icon: Clock, color: "#2dd4bf", title: "Pricing Time Machine", desc: "Simulates customer reactions to any price change." },
  { icon: FileText, color: "#a78bfa", title: "Executive Report", desc: "Board-ready insights, recommendations, and projected uplift." },
];

export function Features() {
  return (
    <section className="container py-20">
      <motion.div {...reveal()} className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold sm:text-4xl text-slate-900">Ten ways to find problems first</h2>
        <p className="mt-3 text-slate-500">One simulation run powers every analysis below.</p>
      </motion.div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div key={f.title} {...reveal(i % 3)} className="group rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 hover:border-violet-200/60">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200/80 bg-slate-50 text-slate-500 transition group-hover:scale-110 group-hover:bg-violet-50 group-hover:border-violet-200 group-hover:text-violet-600">
              <f.icon className="h-5 w-5" />
            </span>
            <p className="mt-3 font-semibold text-slate-800">{f.title}</p>
            <p className="mt-1 text-sm text-slate-500">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function AgentsShowcase() {
  return (
    <section className="container py-20">
      <motion.div {...reveal()} className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold sm:text-4xl text-slate-900">
          A coordinated <span className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">multi-agent</span> brain
        </h2>
        <p className="mt-3 text-slate-500">
          Eight specialized agents — orchestrated with LangGraph — hand off work like a real research team.
        </p>
      </motion.div>
      <div className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-3">
        {AGENTS.map((a, i) => (
          <motion.div key={a.name} {...reveal(i)} className="flex items-center gap-2">
            <div className="flex items-center gap-2.5 rounded-2xl bg-white border border-slate-200/80 px-4 py-3 shadow-sm">
              <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: `${a.color}15`, color: a.color }}>
                <a.icon className="h-4 w-4" />
              </span>
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
    <section id="how" className="container py-20">
      <motion.div {...reveal()} className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold sm:text-4xl text-slate-900">From URL to insight in 7 steps</h2>
      </motion.div>
      <div className="mx-auto mt-10 max-w-2xl space-y-3">
        {STEPS.map((step, i) => (
          <motion.div key={step} {...reveal(i)} className="flex items-center gap-4 rounded-2xl bg-white border border-slate-200/80 p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-violet-200 bg-violet-50 font-mono text-sm font-bold text-violet-600">
              {i + 1}
            </span>
            <span className="font-medium text-slate-700">{step}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="container py-24">
      <motion.div
        {...reveal()}
        className="relative overflow-hidden rounded-3xl border border-violet-200/60 bg-gradient-to-br from-violet-50 via-indigo-50/50 to-blue-50/30 p-10 text-center sm:p-16 shadow-[0_30px_80px_-20px_rgba(124,58,237,0.12)]"
      >
        <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-violet-400/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-blue-400/15 blur-3xl" />
        <div className="relative">
          <h2 className="text-3xl font-bold sm:text-5xl text-slate-900">See your customers before they're real.</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            Run a full simulation in under a minute. No signup, no API key required — it works on the demo engine out
            of the box.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/dashboard">
              <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white border-0 shadow-[0_4px_14px_rgba(124,58,237,0.25)] hover:shadow-[0_4px_20px_rgba(124,58,237,0.4)] transition-all duration-300">
                <Sparkles className="h-4 w-4" /> Launch the swarm
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
