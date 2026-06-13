"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, ShoppingCart, AlertTriangle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedNumber } from "@/components/shared/animated-number";
import { CustomerSwarm, type SwarmNode } from "@/components/swarm/customer-swarm";
import { fadeUp, stagger, wordReveal, EASE } from "@/lib/motion";

const LIVE_INSIGHTS = [
  { icon: AlertTriangle, color: "#fb7185", text: "67% of customers are confused about pricing" },
  { icon: ShoppingCart, color: "#34d399", text: "Enterprise buyers can't find SSO details" },
  { icon: Activity, color: "#22d3ee", text: "Onboarding too complex for non-technical users" },
  { icon: AlertTriangle, color: "#fbbf24", text: "No free tier → self-serve buyers bounce" },
];

const LINE1 = ["Meet", "the", "customers"];
const LEGEND = [
  { label: "Buyer", color: "#34d399" },
  { label: "Undecided", color: "#fbbf24" },
  { label: "Churn", color: "#fb7185" },
];

export function Hero() {
  const [insight, setInsight] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setInsight((i) => (i + 1) % LIVE_INSIGHTS.length), 2600);
    return () => clearInterval(t);
  }, []);

  // weighted, intent-bearing nodes so the decorative universe spreads by buying intent
  const nodes: SwarmNode[] = useMemo(() => {
    const bands = [
      { color: "#34d399", min: 68, max: 96 }, // buyers (right)
      { color: "#34d399", min: 62, max: 90 },
      { color: "#fbbf24", min: 40, max: 62 }, // undecided (middle)
      { color: "#fb7185", min: 8, max: 34 }, // churn (left)
      { color: "#8b5cf6", min: 30, max: 80 },
    ];
    return Array.from({ length: 60 }, (_, i) => {
      const b = bands[i % bands.length];
      const intent = b.min + ((i * 37) % (b.max - b.min));
      return { id: `n${i}`, color: b.color, intent };
    });
  }, []);

  return (
    <section className="relative overflow-hidden pb-20 pt-36 sm:pt-44">
      <div className="container grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left: copy */}
        <motion.div variants={stagger(0.12, 0.1)} initial="hidden" animate="show">
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-foreground/80 backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ghost-cyan opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ghost-cyan" />
            </span>
            An AI customer-simulation operating system
          </motion.div>

          <h1 className="mt-6 text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl">
            <motion.span variants={stagger(0.08)} initial="hidden" animate="show" className="flex flex-wrap gap-x-4">
              {LINE1.map((w, i) => (
                <motion.span key={i} variants={wordReveal} className="inline-block">
                  {w}
                </motion.span>
              ))}
            </motion.span>
            <motion.span
              variants={fadeUp}
              className="mt-1 block bg-gradient-to-r from-ghost-violet via-ghost-cyan to-ghost-emerald bg-[length:200%_auto] bg-clip-text text-transparent text-glow animate-gradient-x"
            >
              before they exist.
            </motion.span>
          </h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Ghost Customer AI spins up <span className="text-foreground">hundreds of AI customers</span> that browse your
            site, judge your pricing, and ask the hard questions — exposing conversion blockers, churn risks, and
            revenue leaks <span className="text-foreground">before real customers ever do.</span>
          </motion.p>
          <motion.p variants={fadeUp} className="mt-3 text-sm font-medium text-ghost-violet/90">
            “The AI that becomes your customer before your customer becomes your problem.”
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
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

          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-10">
            {[
              { v: 500, s: "", l: "AI customers / run" },
              { v: 8, s: "", l: "specialized agents" },
              { v: 60, s: "s", l: "to first insight" },
            ].map((m) => (
              <div key={m.l}>
                <p className="font-mono text-3xl font-bold text-foreground">
                  <AnimatedNumber value={m.v} suffix={m.s} />
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{m.l}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: living customer universe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
          className="relative"
        >
          <div className="conic-border relative overflow-hidden rounded-3xl bg-[#070710]/80 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Live customer universe</span>
              <span className="font-mono text-xs text-ghost-cyan">● LIVE</span>
            </div>

            <CustomerSwarm nodes={nodes} height={300} interactive showAxis className="mt-1" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {LEGEND.map((l) => (
                  <span key={l.label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="h-2 w-2 rounded-full" style={{ background: l.color, boxShadow: `0 0 8px ${l.color}` }} />
                    {l.label}
                  </span>
                ))}
              </div>
              <span className="font-mono text-[11px] text-muted-foreground">312 nodes</span>
            </div>

            <div className="mt-3 h-12 overflow-hidden rounded-xl border border-white/5 bg-white/[0.03] px-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={insight}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="flex h-12 items-center gap-2.5"
                >
                  {(() => {
                    const I = LIVE_INSIGHTS[insight].icon;
                    return (
                      <span
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-lg"
                        style={{ background: `${LIVE_INSIGHTS[insight].color}22`, color: LIVE_INSIGHTS[insight].color }}
                      >
                        <I className="h-4 w-4" />
                      </span>
                    );
                  })()}
                  <p className="text-sm text-foreground/90">{LIVE_INSIGHTS[insight].text}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* floating accents */}
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-5 -top-5 h-24 w-24 rounded-3xl bg-ghost-violet/30 blur-2xl"
          />
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-7 -left-7 h-28 w-28 rounded-3xl bg-ghost-cyan/20 blur-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
