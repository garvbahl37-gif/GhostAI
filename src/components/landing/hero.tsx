"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Play } from "lucide-react";
import { AnimatedNumber } from "@/components/shared/animated-number";
import { HeroMockup } from "@/components/landing/hero-mockup";
import { fadeUp, stagger, EASE } from "@/lib/motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-24 pt-28 sm:pt-36">
      {/* Background accent glows (specific to hero area) */}
      <div className="absolute top-[-10%] right-[-5%] -z-10 w-[500px] h-[500px] rounded-full bg-purple-500/40 blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="absolute top-1/4 right-[15%] -z-10 w-[500px] h-[500px] rounded-full bg-violet-500/30 blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="absolute top-1/2 right-0 -z-10 w-[400px] h-[400px] rounded-full bg-blue-500/20 blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-[-15%] left-[-10%] -z-10 w-[600px] h-[600px] rounded-full bg-purple-500/30 blur-[120px] pointer-events-none mix-blend-multiply" />

      <div className="container grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 xl:gap-16">
        {/* ── Left column: Copy ── */}
        <motion.div
          variants={stagger(0.1, 0.05)}
          initial="hidden"
          animate="show"
          className="relative z-10"
        >
          {/* Beta badge */}
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/[0.07] px-3.5 py-1.5 text-xs text-violet-700 shadow-sm"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-500 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-600" />
            </span>
            Beta · 1,200+ simulations run
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="mt-7 text-[2.75rem] font-extrabold leading-[1.02] tracking-tight text-slate-900 sm:text-[3.5rem] md:text-[4rem] lg:text-[4.25rem] xl:text-[4.75rem]"
          >
            MEET YOUR
            <br />
            CUSTOMERS{" "}
            <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
              BEFORE
            </span>
            <br />
            REALITY DOES.
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-slate-500"
          >
            Experience your product through the eyes of{" "}
            <span className="font-semibold text-slate-800">hyper-realistic AI customer personas</span>{" "}
            — uncovering deep product feedback, detecting onboarding objections, and{" "}
            <span className="font-semibold text-slate-800">predicting churn</span>{" "}
            in real-time before you launch.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            className="mt-9 flex flex-col sm:flex-row flex-wrap gap-3.5 items-start sm:items-center"
          >
            <Link href="/dashboard">
              <button
                id="hero-start-simulation"
                className="group relative overflow-hidden rounded-xl bg-violet-600 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(124,58,237,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-[0_8px_25px_rgba(124,58,237,0.45)] flex items-center gap-2"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                <span className="relative z-10">Start Simulation</span>
                <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </Link>

            <Link href="#how">
              <button
                id="hero-watch-demo"
                className="group flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/50 hover:bg-violet-50/50 hover:text-violet-700 hover:shadow-[0_4px_14px_rgba(124,58,237,0.08)]"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-violet-400/30 bg-violet-50 transition-all duration-300 group-hover:bg-violet-100 group-hover:border-violet-400/60">
                  <Play className="h-2.5 w-2.5 fill-violet-600 text-violet-600 ml-0.5" />
                </span>
                Watch Demo
              </button>
            </Link>
          </motion.div>

          {/* Trust nudge */}
          <motion.div
            variants={fadeUp}
            className="mt-5 text-xs text-slate-400 flex items-center gap-2"
          >
            <CheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
            No credit card required · Free tier includes 50 persona runs
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            variants={fadeUp}
            className="mt-12 flex flex-wrap gap-x-10 gap-y-5 pt-8 border-t border-slate-200/80 w-full max-w-lg"
          >
            {[
              { v: 94.2, s: "%", l: "Churn prediction accuracy" },
              { v: 60, s: "s", l: "To first swarm insight" },
              { v: 2.4, s: "M", l: "Avg. revenue leak found", prefix: "$" },
            ].map((m) => (
              <div key={m.l} className="flex flex-col">
                <p className="font-mono text-2xl font-bold text-slate-900">
                  {m.prefix}
                  <AnimatedNumber value={m.v} suffix={m.s} />
                </p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {m.l}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Right column: Floating Dashboard Cards Mockup ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
          className="relative hidden lg:flex items-center justify-center"
        >
          <HeroMockup />
        </motion.div>

        {/* Mobile-only: simplified single card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="relative flex lg:hidden items-center justify-center"
        >
          <div className="w-full max-w-sm rounded-2xl border border-white/[0.12] bg-[#07070d] p-5 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7)]">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
              <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-100 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-violet-500 shadow-[0_0_8px_#8b5cf6]" />
                Simulation Dashboard
              </span>
              <span className="text-[8px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-2.5">
                <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-500">CONVERSION</span>
                <p className="text-sm font-bold text-emerald-400 mt-0.5">+14.2%</p>
              </div>
              <div className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-2.5">
                <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-500">CHURN PRED.</span>
                <p className="text-sm font-bold text-rose-400 mt-0.5">94.2% Acc.</p>
              </div>
            </div>
            <div className="space-y-2 text-[9px] font-mono text-zinc-400">
              <div className="flex gap-1.5">
                <span className="text-zinc-600">[12:44]</span>
                <span><strong className="text-violet-300">Sarah Chen</strong> → Will Purchase 🟢</span>
              </div>
              <div className="flex gap-1.5">
                <span className="text-zinc-600">[12:44]</span>
                <span className="text-amber-400">Devon Patel → Objection: Pricing 🟡</span>
              </div>
              <div className="flex gap-1.5">
                <span className="text-zinc-600">[12:44]</span>
                <span className="text-rose-400">Marcus Vance → High Churn Risk 🔴</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
