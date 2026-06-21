"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap, AlertTriangle, Users, TrendingUp, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedNumber } from "@/components/shared/animated-number";
import { CustomerSwarm, type SwarmNode } from "@/components/swarm/customer-swarm";
import { fadeUp, stagger, wordReveal, EASE } from "@/lib/motion";

const HEAD_1 = ["Meet", "your", "customers"];
const HEAD_2 = ["before", "reality", "does."];

export function Hero() {
  // Dense particle sphere with color-coded status nodes representing interactive simulated customers
  const nodes: SwarmNode[] = useMemo(() => {
    const shades = ["#ffffff", "#ffffff", "#f0f0f2", "#e2e2e6", "#cfcfd4", "#b6b6be"];
    const baseNodes = Array.from({ length: 420 }, (_, i) => ({
      id: `c${i}`,
      color: shades[i % shades.length],
    }));

    // High-value, status-colored interactive customer nodes (placed first to be prominent)
    const interactiveNodes: SwarmNode[] = [
      {
        id: "i1",
        color: "#fb7185", // Rose (high churn risk / objection)
        name: "Devon Patel",
        role: "VP Product, Enterprise SaaS",
        verdict: "High Churn Risk 🔴",
        intent: 12,
      },
      {
        id: "i2",
        color: "#34d399", // Emerald (high purchase intent)
        name: "Sarah Chen",
        role: "Founder, Seed DevTools",
        verdict: "Will Purchase 🟢",
        intent: 92,
      },
      {
        id: "i3",
        color: "#fbbf24", // Amber (active objection)
        name: "Marcus Vance",
        role: "Head of Growth, FinTech",
        verdict: "Objection: Pricing model 🟡",
        intent: 45,
      },
      {
        id: "i4",
        color: "#a78bfa", // Violet (active simulator)
        name: "Alex Mercer",
        role: "CTO, DevTools Startup",
        verdict: "Active: Simulating Setup 🟣",
        intent: 78,
      },
      {
        id: "i5",
        color: "#fb7185",
        name: "Jessica Taylor",
        role: "Director of Product, RetailTech",
        verdict: "Objection: Integration lag 🔴",
        intent: 24,
      },
      {
        id: "i6",
        color: "#34d399",
        name: "David Kim",
        role: "VP Engineering, HealthTech",
        verdict: "Will Purchase 🟢",
        intent: 88,
      },
      {
        id: "i7",
        color: "#22d3ee", // Cyan (high adoption)
        name: "Elena Rostova",
        role: "Product Marketing Manager",
        verdict: "High Adoption Rate 🔵",
        intent: 85,
      },
      {
        id: "i8",
        color: "#fbbf24",
        name: "Tomás Silva",
        role: "Head of Sales, Web3 Platform",
        verdict: "Objection: No Slack alert 🟡",
        intent: 52,
      },
    ];

    return [...interactiveNodes, ...baseNodes];
  }, []);

  return (
    <section className="relative overflow-hidden pb-24 pt-40 sm:pt-48">
      {/* Premium ambient glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 -z-10 w-[450px] h-[450px] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 -z-10 w-[550px] h-[550px] rounded-full bg-cyan-600/5 blur-[130px] pointer-events-none" />

      <div className="container grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left: copywriting and trust metrics */}
        <motion.div variants={stagger(0.1, 0.05)} initial="hidden" animate="show">
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/[0.05] px-3.5 py-1.5 text-xs text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.1)] backdrop-blur"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-500" />
            </span>
            Beta · 1,200+ simulations run
          </motion.div>

          <h1 className="mt-7 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-[4.75rem] text-glow">
            <motion.span variants={stagger(0.07)} initial="hidden" animate="show" className="block text-white leading-tight">
              Meet your customers
            </motion.span>
            <motion.span variants={stagger(0.07)} initial="hidden" animate="show" className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent leading-normal py-1">
              before reality does.
            </motion.span>
          </h1>

          <motion.p variants={fadeUp} className="mt-7 max-w-xl text-lg leading-relaxed text-zinc-400">
            GhostCustomer AI simulates <span className="text-white font-medium">hundreds of autonomous AI customer personas</span> that crawl your product, raise onboarding objections, and predict churn — <span className="text-white font-medium">before you launch.</span> Designed for product, marketing, and growth teams.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] border-0 transition-all duration-300 py-6 px-8 rounded-xl flex items-center gap-2">
                Start Simulation <ArrowRight className="h-4.5 w-4.5" />
              </Button>
            </Link>
            <Link href="#how">
              <Button variant="outline" size="lg" className="border-white/10 hover:border-white/20 bg-white/[0.02] text-zinc-300 hover:text-white transition-all duration-300 py-6 px-8 rounded-xl flex items-center gap-2 backdrop-blur-md">
                Book Demo
              </Button>
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
            <CheckCircle className="h-3.5 w-3.5 text-violet-400 flex-shrink-0" />
            No credit card required. Free tier includes 50 persona runs.
          </motion.div>

          {/* Stats Bar */}
          <motion.div variants={fadeUp} className="mt-14 flex flex-wrap gap-x-12 gap-y-6 pt-8 border-t border-white/[0.06] w-full max-w-lg">
            {[
              { v: 94.2, s: "%", l: "Churn prediction accuracy" },
              { v: 60, s: "s", l: "To first swarm insight" },
              { v: 2.4, s: "M", l: "Avg. revenue leak found", prefix: "$" },
            ].map((m) => (
              <div key={m.l} className="flex flex-col">
                <p className="font-mono text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                  {m.prefix}
                  <AnimatedNumber value={m.v} suffix={m.s} />
                </p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{m.l}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: Enhanced Customer Network (Globe + Floating mockups) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: EASE }}
          className="relative min-h-[460px] flex items-center justify-center"
        >
          {/* Central network card */}
          <div className="ring-border w-full relative overflow-hidden rounded-[28px] bg-white/[0.01] p-6 backdrop-blur-xl border border-white/[0.06]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                Customer Intelligence Network
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE SIMULATION
              </span>
            </div>

            <CustomerSwarm nodes={nodes} variant="sphere" height={380} interactive className="my-2" />

            <div className="flex justify-between items-center mt-2 px-1 text-[10px] text-muted-foreground/80">
              <span className="uppercase tracking-[0.12em]">Network of simulated customers</span>
              <span>Hover nodes to inspect details</span>
            </div>
          </div>

          {/* Floating Insight Card 1 (Top Left) */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 -left-6 z-10 hidden sm:block glass rounded-2xl p-4 shadow-2xl backdrop-blur-xl border border-white/[0.08] bg-black/40 w-[240px]"
          >
            <div className="flex items-center gap-2 mb-2.5">
              <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[10px] font-semibold tracking-wider text-rose-400 uppercase">Simulated Persona</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-violet-300">DP</div>
              <div>
                <h4 className="text-xs font-semibold text-white">Devon Patel</h4>
                <p className="text-[10px] text-muted-foreground">VP Product, Enterprise SaaS</p>
              </div>
            </div>
            <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2 mt-2">
              <p className="text-[10px] text-zinc-300 leading-normal">"Objection: ROI of annual contract is unclear. Needs SOC2 check."</p>
              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/[0.04]">
                <span className="text-[9px] text-rose-400 font-semibold">85% Churn Risk 🔴</span>
                <span className="text-[9px] text-muted-foreground">Intent: 12%</span>
              </div>
            </div>
          </motion.div>

          {/* Floating Insight Card 2 (Top Right) */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -top-12 -right-4 z-10 hidden sm:block glass rounded-2xl p-4 shadow-2xl backdrop-blur-xl border border-white/[0.08] bg-black/40 w-[240px]"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-[10px] font-semibold tracking-wider text-amber-400 uppercase">Live Objection</span>
              </div>
              <span className="text-[9px] font-mono text-muted-foreground">Active</span>
            </div>
            <p className="text-xs font-medium text-white mb-1">"Why do we need another dashboard?"</p>
            <p className="text-[10px] text-muted-foreground mb-3">Raised by 42% of Growth Leads</p>
            <div className="flex items-center justify-between bg-amber-500/5 border border-amber-500/10 rounded-lg p-2 text-[9px] text-amber-400">
              <span className="font-medium">Product Fix Recommended</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </motion.div>

          {/* Floating Insight Card 3 (Bottom Left) */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute -bottom-6 -left-10 z-10 hidden md:block glass rounded-2xl p-4 shadow-2xl backdrop-blur-xl border border-white/[0.08] bg-black/40 w-[220px]"
          >
            <div className="flex items-center gap-2 mb-2.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">Simulated Persona</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-emerald-300">SC</div>
              <div>
                <h4 className="text-xs font-semibold text-white">Sarah Chen</h4>
                <p className="text-[10px] text-muted-foreground">Founder, Seed DevTools</p>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px]">
              <span className="text-emerald-400 font-semibold">Will Purchase 🟢</span>
              <span className="font-mono text-zinc-400">Intent: 92%</span>
            </div>
          </motion.div>

          {/* Floating Insight Card 4 (Bottom Right) */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-10 -right-6 z-10 hidden sm:block glass rounded-2xl p-4 shadow-2xl backdrop-blur-xl border border-white/[0.08] bg-black/40 w-[210px]"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">Funnel Lift</span>
            </div>
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-2xl font-bold tracking-tight text-white">+14.2%</span>
              <span className="text-[10px] text-emerald-400 font-medium">Conversion</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-normal">
              Predicted lift after addressing pricing structure objections.
            </p>
          </motion.div>

          {/* Faint ambient halo backdrop */}
          <div className="absolute inset-0 -z-10 rounded-[28px] bg-white/[0.02] blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
