"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Ghost } from "lucide-react";
import { AGENTS } from "@/components/war-room/agent-meta";
import { EASE } from "@/lib/motion";

const ORBIT = Array.from({ length: 10 }, (_, i) => `node-${i}`);
const NODE_COLORS = ["#e5e5e7", "#d4d4d8", "#c8c8cc", "#7dd3fc", "#6ee7b7", "#ffffff"];

const BOOT_LINES = [
  "Initializing simulation engine…",
  "Scanning website…",
  "Generating personas…",
  "Creating market model…",
  "Running simulations…",
  "Detecting revenue leaks…",
  "Predicting churn…",
  "Generating executive report…",
];

const STAGE = 340;
const CENTER = STAGE / 2;
const R = 138;

function nodePos(i: number, n: number) {
  const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
  return { x: CENTER + Math.cos(angle) * R, y: CENTER + Math.sin(angle) * R };
}

/** Cinematic graphite boot sequence — white lines, silver core, no spinner. */
export function CinematicLoader({ progress = 0, label }: { progress?: number; label?: string }) {
  const [lit, setLit] = useState(0);
  const [line, setLine] = useState(0);

  useEffect(() => {
    const a = setInterval(() => setLit((l) => (l + 1) % (AGENTS.length + 1)), 280);
    const b = setInterval(() => setLine((l) => (l + 1) % BOOT_LINES.length), 1500);
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
      exit={{ opacity: 0, scale: 1.12, filter: "blur(16px)" }}
      transition={{ duration: 0.7, ease: EASE }}
      className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[#050506]"
    >
      {/* ambient graphite light */}
      <div className="absolute left-1/2 top-1/2 h-[52rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.05] blur-[160px] anim-glow-pulse" />
      <div className="absolute inset-0 grain opacity-[0.06] mix-blend-overlay" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(0,0,0,0.78))]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" style={{ animation: "scan-line 4.5s linear infinite" }} />

      <div className="relative flex flex-col items-center">
        <div className="relative" style={{ width: STAGE, height: STAGE }}>
          {/* rotating white glint arc */}
          <div
            className="absolute inset-5 rounded-full anim-spin-slow"
            style={{
              background: "conic-gradient(from 0deg, transparent 0deg 215deg, rgba(255,255,255,0.85) 305deg, rgba(255,255,255,0.2) 350deg, transparent 360deg)",
              WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 2px))",
              mask: "radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 2px))",
            }}
          />
          {/* counter-rotating faint arc */}
          <div
            className="absolute inset-2 rounded-full anim-spin-slow-rev"
            style={{
              background: "conic-gradient(from 120deg, transparent 0deg 285deg, rgba(125,211,252,0.6) 345deg, transparent 360deg)",
              WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1px))",
              mask: "radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1px))",
            }}
          />
          <div className="absolute inset-0 rounded-full border border-dashed border-white/12" />
          <div className="absolute inset-[4.5rem] rounded-full border border-white/[0.06]" />

          {/* connecting lines */}
          <svg className="absolute inset-0 anim-glow-pulse" viewBox={`0 0 ${STAGE} ${STAGE}`} fill="none">
            {ORBIT.map((_, i) => {
              const { x, y } = nodePos(i, ORBIT.length);
              return <line key={i} x1={CENTER} y1={CENTER} x2={x} y2={y} stroke="rgba(255,255,255,0.12)" strokeWidth={1} />;
            })}
          </svg>

          {/* orbiting nodes */}
          {ORBIT.map((seed, i) => {
            const { x, y } = nodePos(i, ORBIT.length);
            const color = NODE_COLORS[i % NODE_COLORS.length];
            return (
              <div key={seed} className="absolute" style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 + i * 0.07, duration: 0.5, ease: EASE }}
                  className="h-3 w-3 rounded-full"
                  style={{ background: `radial-gradient(circle at 32% 30%, #ffffff, ${color})`, boxShadow: `0 0 16px ${color}, 0 0 5px ${color}` }}
                />
              </div>
            );
          })}

          {/* core mark — dark graphite disc, white ghost */}
          <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.07] blur-2xl" />
          <motion.div
            initial={{ scale: 0, rotate: -40 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-3xl border border-white/12 bg-gradient-to-br from-[#1b1b1f] to-[#0c0c0e] anim-glow-pulse"
            style={{ boxShadow: "0 0 50px rgba(255,255,255,0.18), inset 0 1px 0 rgba(255,255,255,0.12)" }}
          >
            <Ghost className="h-12 w-12 text-white" />
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
          className="mt-2 text-center text-base font-semibold uppercase tracking-[0.34em] text-foreground/90"
        >
          Ghost <span className="gradient-text">Customer</span> AI
        </motion.h1>

        <motion.p
          key={label ?? line}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2.5 h-5 text-center text-sm text-muted-foreground"
        >
          {label || BOOT_LINES[line]}
        </motion.p>

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

        <div className="mt-6 flex w-72 items-center gap-3">
          <div className="h-px flex-1 bg-white/10">
            <motion.div
              className="h-px bg-white/80"
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: EASE }}
              style={{ boxShadow: "0 0 10px rgba(255,255,255,0.6)" }}
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
            background: "conic-gradient(from 0deg, transparent 0deg 220deg, rgba(255,255,255,0.85) 330deg, transparent 360deg)",
            WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1.5px))",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1.5px))",
          }}
        />
        <div className="absolute inset-0 grid place-items-center">
          <Ghost className="h-6 w-6 text-foreground/80 anim-glow-pulse" />
        </div>
      </div>
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
}
