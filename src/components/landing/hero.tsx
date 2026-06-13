"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedNumber } from "@/components/shared/animated-number";
import { CustomerSwarm, type SwarmNode } from "@/components/swarm/customer-swarm";
import { fadeUp, stagger, wordReveal, EASE } from "@/lib/motion";

const HEAD_1 = ["Meet", "customers"];
const HEAD_2 = ["before", "reality", "does."];

export function Hero() {
  // dense monochrome particle sphere — hundreds of white dots
  const nodes: SwarmNode[] = useMemo(() => {
    const shades = ["#ffffff", "#ffffff", "#f0f0f2", "#e2e2e6", "#cfcfd4", "#b6b6be"];
    return Array.from({ length: 440 }, (_, i) => ({ id: `c${i}`, color: shades[i % shades.length] }));
  }, []);

  return (
    <section className="relative overflow-hidden pb-24 pt-40 sm:pt-48">
      <div className="container grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left: copy */}
        <motion.div variants={stagger(0.1, 0.05)} initial="hidden" animate="show">
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-foreground/70 backdrop-blur"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d6d6da] opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#d6d6da]" />
            </span>
            Customer intelligence platform
          </motion.div>

          <h1 className="mt-7 text-6xl font-semibold leading-[0.98] tracking-tight sm:text-[5.5rem]">
            <motion.span variants={stagger(0.07)} initial="hidden" animate="show" className="flex flex-wrap gap-x-4">
              {HEAD_1.map((w, i) => (
                <motion.span key={i} variants={wordReveal} className="inline-block">
                  {w}
                </motion.span>
              ))}
            </motion.span>
            <motion.span variants={stagger(0.07)} initial="hidden" animate="show" className="flex flex-wrap gap-x-4">
              {HEAD_2.map((w, i) => (
                <motion.span key={i} variants={wordReveal} className="inline-block gradient-text">
                  {w}
                </motion.span>
              ))}
            </motion.span>
          </h1>

          <motion.p variants={fadeUp} className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Ghost Customer AI simulates <span className="text-foreground">hundreds of future customers</span> to uncover
            objections, churn risks, and revenue leaks — <span className="text-foreground">before launch.</span>
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-3">
            <Link href="/dashboard">
              <Button size="lg">
                <Play className="h-4 w-4" /> Run a live simulation
              </Button>
            </Link>
            <Link href="#how">
              <Button variant="outline" size="lg">
                See how it works <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-12 flex flex-wrap gap-10">
            {[
              { v: 500, s: "", l: "AI customers / run" },
              { v: 8, s: "", l: "specialized agents" },
              { v: 60, s: "s", l: "to first insight" },
            ].map((m) => (
              <div key={m.l}>
                <p className="font-mono text-3xl font-semibold text-foreground">
                  <AnimatedNumber value={m.v} suffix={m.s} />
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{m.l}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: Customer Intelligence Core */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: EASE }}
          className="relative"
        >
          <div className="ring-border relative overflow-hidden rounded-[28px] bg-white/[0.02] p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Customer Intelligence Core
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-foreground/70">
                <span className="h-1.5 w-1.5 rounded-full bg-white anim-glow-pulse" /> LIVE
              </span>
            </div>

            <CustomerSwarm nodes={nodes} variant="sphere" height={360} interactive className="my-2" />

            <p className="text-center text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70">
              Hundreds of simulated customers · rotating in real time
            </p>
          </div>

          {/* faint ambient halo */}
          <div className="absolute inset-0 -z-10 rounded-[28px] bg-white/[0.04] blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
