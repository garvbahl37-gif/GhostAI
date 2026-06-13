"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Ghost } from "lucide-react";
import { AGENTS } from "@/components/war-room/agent-meta";
import { EASE } from "@/lib/motion";

const ORBIT = Array.from({ length: 10 }, (_, i) => `node-${i}`);
const NODE_COLORS = ["#8b5cf6", "#22d3ee", "#34d399", "#fbbf24", "#fb7185", "#a78bfa"];

const BOOT_LINES = [
  "Initializing simulation core…",
  "Crawling the target experience…",
  "Synthesizing customer personas…",
  "Waking the customer swarm…",
  "Deploying sales & support agents…",
  "Calibrating revenue models…",
];

const STAGE = 340;
const CENTER = STAGE / 2;
const R = 138;

function nodePos(i: number, n: number) {
  const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
  return { x: CENTER + Math.cos(angle) * R, y: CENTER + Math.sin(angle) * R };
}

/** Full-screen cinematic boot sequence shown while a run spins up. */
export function CinematicLoader({ progress = 0, label }: { progress?: number; label?: string }) {
  const [lit, setLit] = useState(0);
  const [line, setLine] = useState(0);

  useEffect(() => {
    const a = setInterval(() => setLit((l) => (l + 1) % (AGENTS.length + 1)), 280);
    const b = setInterval(() => setLine((l) => (l + 1) % BOOT_LINES.length), 1700);
    return () => {
      clearInterval(a);
      clearInterval(b);
    };
  }, []);

  const pct = Math.max(4, Math.round(progress));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.14, filter: "blur(16px)" }}
      transition={{ duration: 0.7, ease: EASE }}
      className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[#05050c]"
    >
      {/* ambient field */}
      <div className="absolute left-1/2 top-1/2 h-[55rem] w-[55rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ghost-violet/15 blur-[150px] anim-glow-pulse" />
      <div className="absolute inset-0 grain opacity-[0.07] mix-blend-overlay" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.75))]" />
      {/* floating particles */}
      {[
        { l: "18%", t: "26%", d: 0 }, { l: "82%", t: "30%", d: 1.2 }, { l: "26%", t: "74%", d: 0.6 },
        { l: "76%", t: "70%", d: 1.8 }, { l: "50%", t: "14%", d: 0.9 }, { l: "60%", t: "86%", d: 1.5 },
      ].map((p, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-white/40"
          style={{ left: p.l, top: p.t }}
          animate={{ y: [0, -18, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 4 + p.d, repeat: Infinity, ease: "easeInOut", delay: p.d }}
        />
      ))}

      <div className="relative flex flex-col items-center">
        {/* orbital stage */}
        <div className="relative" style={{ width: STAGE, height: STAGE }}>
          {/* glow bloom behind rings */}
          <div className="absolute inset-8 rounded-full bg-ghost-violet/10 blur-2xl" />

          {/* bright rotating glow arc */}
          <div
            className="absolute inset-5 rounded-full anim-spin-slow"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg 210deg, rgba(34,211,238,0.9) 300deg, rgba(139,92,246,1) 350deg, transparent 360deg)",
              WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2.5px))",
              mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2.5px))",
              filter: "drop-shadow(0 0 6px rgba(139,92,246,0.8))",
            }}
          />
          {/* counter-rotating thin arc */}
          <div
            className="absolute inset-2 rounded-full anim-spin-slow-rev"
            style={{
              background: "conic-gradient(from 120deg, transparent 0deg 280deg, rgba(52,211,153,0.8) 340deg, transparent 360deg)",
              WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1.5px))",
              mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1.5px))",
            }}
          />
          {/* dashed + inner rings */}
          <div className="absolute inset-0 rounded-full border border-dashed border-white/12" />
          <div className="absolute inset-[4.5rem] rounded-full border border-white/[0.06]" />

          {/* neural connecting lines */}
          <svg className="absolute inset-0 anim-glow-pulse" viewBox={`0 0 ${STAGE} ${STAGE}`} fill="none">
            <defs>
              <radialGradient id="line-g" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.05" />
              </radialGradient>
            </defs>
            {ORBIT.map((_, i) => {
              const { x, y } = nodePos(i, ORBIT.length);
              return <line key={i} x1={CENTER} y1={CENTER} x2={x} y2={y} stroke="url(#line-g)" strokeWidth={1} />;
            })}
          </svg>

          {/* orbiting customer nodes (static-positioned wrapper, animated inner) */}
          {ORBIT.map((seed, i) => {
            const { x, y } = nodePos(i, ORBIT.length);
            const color = NODE_COLORS[i % NODE_COLORS.length];
            return (
              <div
                key={seed}
                className="absolute"
                style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 + i * 0.07, duration: 0.5, ease: EASE }}
                  className="h-3.5 w-3.5 rounded-full"
                  style={{
                    background: `radial-gradient(circle at 32% 30%, #ffffff, ${color})`,
                    boxShadow: `0 0 18px ${color}, 0 0 6px ${color}`,
                  }}
                />
              </div>
            );
          })}

          {/* core mark */}
          <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ghost-violet/40 blur-2xl" />
          <motion.div
            initial={{ scale: 0, rotate: -40 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-3xl bg-gradient-to-br from-ghost-violet to-ghost-indigo anim-glow-pulse"
            style={{ boxShadow: "0 0 70px rgba(139,92,246,0.85), inset 0 0 20px rgba(255,255,255,0.2)" }}
          >
            <Ghost className="h-12 w-12 text-white drop-shadow" />
          </motion.div>
        </div>

        {/* title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
          className="mt-2 text-center text-base font-bold uppercase tracking-[0.32em] text-foreground/90"
        >
          Ghost <span className="gradient-text">Customer</span> AI
        </motion.h1>

        {/* boot status */}
        <motion.p
          key={label ?? line}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2.5 h-5 text-center text-sm text-muted-foreground"
        >
          {label || BOOT_LINES[line]}
        </motion.p>

        {/* agent pipeline dots */}
        <div className="mt-5 flex items-center gap-2.5">
          {AGENTS.map((a, i) => (
            <motion.span
              key={a.name}
              animate={{
                scale: i === lit ? 1.8 : 1,
                opacity: i <= lit || lit === AGENTS.length ? 1 : 0.25,
                boxShadow: i === lit ? `0 0 12px ${a.color}` : "0 0 0px transparent",
              }}
              transition={{ duration: 0.25 }}
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: a.color }}
            />
          ))}
        </div>

        {/* progress */}
        <div className="mt-6 flex w-72 items-center gap-3">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-ghost-violet via-ghost-cyan to-ghost-emerald"
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: EASE }}
              style={{ boxShadow: "0 0 12px rgba(34,211,238,0.7)" }}
            />
          </div>
          <span className="w-10 text-right font-mono text-sm font-semibold text-foreground/80">{pct}%</span>
        </div>
      </div>
    </motion.div>
  );
}

/** Compact branded spinner for in-page loading states. */
export function BrandedSpinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-14 w-14">
        <div
          className="absolute inset-0 rounded-2xl anim-spin-slow"
          style={{
            background: "conic-gradient(from 0deg, transparent 0deg 220deg, #22d3ee 320deg, #8b5cf6 360deg)",
            WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 2px))",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 2px))",
          }}
        />
        <div className="absolute inset-0 grid place-items-center">
          <Ghost className="h-6 w-6 text-ghost-violet anim-glow-pulse" />
        </div>
      </div>
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
}
