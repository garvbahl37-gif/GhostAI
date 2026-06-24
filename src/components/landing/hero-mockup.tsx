"use client";

import { motion } from "framer-motion";
import { 
  Play, Terminal, AlertTriangle, CheckCircle, 
  Flame, TrendingUp, BarChart2, Activity, User
} from "lucide-react";

export function HeroMockup() {
  return (
    <div className="relative w-full h-[540px] md:h-[600px] flex items-center justify-center [perspective:1500px] -translate-y-12 md:-translate-y-24">
      {/* 3D Container with isometric tilt */}
      <div 
        className="relative w-full max-w-[500px] h-[450px] transition-transform duration-700 ease-out [transform-style:preserve-3d] hover:[transform:rotateY(-8deg)_rotateX(4deg)] md:[transform:rotateY(-18deg)_rotateX(10deg)_rotateZ(-4deg)]"
      >
        {/* Card 4: Friction Scores (Backmost - Right) */}
        <motion.div
          initial={{ opacity: 0, y: 40, z: -100 }}
          animate={{ opacity: 1, y: 0, z: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          whileHover={{ y: -15, z: 50, scale: 1.02 }}
          className="absolute right-[-10%] top-[5%] w-[240px] rounded-2xl border border-white/[0.12] bg-[#0c0c16] p-4 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] ring-1 ring-white/5 cursor-pointer select-none transition-all duration-300 z-10"
        >
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-3">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-400">
              <TrendingUp className="h-3 w-3" /> Friction Scores
            </span>
            <span className="text-[9px] font-mono text-zinc-500">LIVE FEED</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="text-[11px] text-zinc-400">Onboarding Funnel</span>
                <span className="text-[12px] font-mono font-bold text-rose-400">68/100</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-yellow-500 to-rose-500 rounded-full" style={{ width: "68%" }} />
              </div>
            </div>

            {/* Funnel chart mockup */}
            <div className="pt-2">
              <svg viewBox="0 0 100 40" className="w-full h-12 overflow-visible">
                <path
                  d="M0,35 Q20,10 40,28 T80,5 T100,20"
                  fill="none"
                  stroke="rgba(244, 63, 94, 0.7)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Dots on peak points */}
                <circle cx="40" cy="28" r="3" fill="#f59e0b" />
                <circle cx="80" cy="5" r="3" fill="#f43f5e" />
              </svg>
              <div className="flex justify-between text-[8px] text-zinc-500 font-mono mt-1">
                <span>HOME</span>
                <span>PRICING</span>
                <span>SIGNUP</span>
                <span>FLOW</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card 3: Persona Logs (Middle Right) */}
        <motion.div
          initial={{ opacity: 0, y: 40, z: -50 }}
          animate={{ opacity: 1, y: 0, z: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          whileHover={{ y: -15, z: 60, scale: 1.02 }}
          className="absolute right-[-2%] top-[35%] w-[270px] rounded-2xl border border-white/[0.12] bg-[#090911] p-4 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] ring-1 ring-white/5 cursor-pointer select-none transition-all duration-300 z-20"
        >
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-2.5">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-400">
              <Terminal className="h-3.5 w-3.5" /> Persona Logs
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="font-mono text-[9px] text-zinc-400 space-y-2 leading-relaxed">
            <div className="flex items-start gap-1">
              <span className="text-zinc-600">[12:44:11]</span>
              <span>
                <strong className="text-violet-300">Alex (CTO)</strong> visited <span className="text-indigo-300">/pricing</span>
              </span>
            </div>
            <div className="flex items-start gap-1">
              <span className="text-zinc-600">[12:44:15]</span>
              <span>
                <span className="text-amber-400">⚠️ Objection:</span> "No annual discount info listed"
              </span>
            </div>
            <div className="flex items-start gap-1">
              <span className="text-zinc-600">[12:44:18]</span>
              <span>
                <strong className="text-violet-300">Sarah (Founder)</strong> clicked <span className="text-indigo-300">Start Trial</span>
              </span>
            </div>
            <div className="flex items-start gap-1">
              <span className="text-zinc-600">[12:44:22]</span>
              <span>
                <span className="text-rose-400">🔴 Blocked:</span> Phone verification field required
              </span>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Heatmap Analysis (Middle Left) */}
        <motion.div
          initial={{ opacity: 0, y: 40, z: -20 }}
          animate={{ opacity: 1, y: 0, z: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{ y: -15, z: 70, scale: 1.02 }}
          className="absolute left-[-5%] top-[25%] w-[290px] rounded-2xl border border-white/[0.12] bg-[#0b0c15]/95 p-4 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] ring-1 ring-white/5 cursor-pointer select-none transition-all duration-300 z-30"
        >
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-3">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
              <Flame className="h-3.5 w-3.5" /> Heatmap Analysis
            </span>
            <span className="text-[9px] text-zinc-500 font-mono">HOVER HOTSPOTS</span>
          </div>

          <div className="relative rounded-lg border border-white/[0.05] bg-black/40 p-2.5 overflow-hidden">
            {/* Mock website page with hotspots */}
            <div className="flex justify-between items-center mb-3">
              <div className="h-3 w-10 bg-white/10 rounded" />
              <div className="flex gap-2">
                <div className="h-2 w-4 bg-white/5 rounded" />
                <div className="h-2 w-4 bg-white/5 rounded" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-4 w-2/3 bg-white/10 rounded" />
              <div className="h-2 w-full bg-white/5 rounded" />
              
              {/* Pricing Cards Mockup */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="border border-white/5 bg-white/[0.02] p-2 rounded relative">
                  <div className="h-2 w-8 bg-white/10 rounded mb-1" />
                  <div className="h-3 w-12 bg-white/20 rounded" />
                  {/* Heat glow hotspot 1 */}
                  <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-red-500/35 blur-md animate-pulse" />
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
                </div>
                <div className="border border-white/5 bg-white/[0.02] p-2 rounded relative">
                  <div className="h-2 w-8 bg-white/10 rounded mb-1" />
                  <div className="h-3 w-12 bg-white/20 rounded" />
                  {/* Heat glow hotspot 2 */}
                  <span className="absolute -left-1 bottom-1 h-7 w-7 rounded-full bg-orange-500/25 blur-md animate-pulse" />
                  <span className="absolute left-2 bottom-3 h-2 w-2 rounded-full bg-orange-500" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card 1: Simulation Dashboard (Foreground Left) */}
        <motion.div
          initial={{ opacity: 0, y: 40, z: 0 }}
          animate={{ opacity: 1, y: 0, z: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          whileHover={{ y: -15, z: 80, scale: 1.02 }}
          className="absolute left-[-15%] top-[8%] w-[330px] sm:w-[350px] rounded-3xl border border-white/[0.15] bg-[#07070d] p-5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3),0_30px_60px_-30px_rgba(139,92,246,0.15)] ring-1 ring-white/10 cursor-pointer select-none transition-all duration-300 z-40"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-violet-500 shadow-[0_0_8px_#8b5cf6]" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-100">
                Simulation Dashboard
              </span>
            </div>
            <span className="flex items-center gap-1 rounded bg-violet-500/10 border border-violet-500/25 px-1.5 py-0.5 text-[8px] font-bold text-violet-400 uppercase tracking-widest font-mono">
              <Activity className="h-2 w-2 animate-pulse" /> Running Swarm
            </span>
          </div>

          {/* Metric Row */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-2.5">
              <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-500">CONVERSION UPLIFT</span>
              <p className="text-sm font-bold text-emerald-400 mt-0.5">+14.2%</p>
            </div>
            <div className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-2.5">
              <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-500">CHURN PREDICTION</span>
              <p className="text-sm font-bold text-rose-400 mt-0.5">94.2% Acc.</p>
            </div>
          </div>

          {/* Swarm Node List */}
          <div className="space-y-2.5">
            <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
              Active Simulated Personas
            </span>

            {/* Persona 1 */}
            <div className="flex items-center justify-between rounded-xl bg-white/[0.02] p-2 border border-white/[0.04]">
              <div className="flex items-center gap-2">
                <div className="grid h-6.5 w-6.5 place-items-center rounded bg-violet-500/10 text-violet-400">
                  <User className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-200">Sarah Chen</p>
                  <p className="text-[8px] text-zinc-500">Founder, Seed DevTools</p>
                </div>
              </div>
              <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 text-[8px] font-semibold text-emerald-400">
                Will Purchase 🟢
              </span>
            </div>

            {/* Persona 2 */}
            <div className="flex items-center justify-between rounded-xl bg-white/[0.02] p-2 border border-white/[0.04]">
              <div className="flex items-center gap-2">
                <div className="grid h-6.5 w-6.5 place-items-center rounded bg-indigo-500/10 text-indigo-400">
                  <User className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-200">Devon Patel</p>
                  <p className="text-[8px] text-zinc-500">VP Product, SaaS</p>
                </div>
              </div>
              <span className="rounded bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 text-[8px] font-semibold text-rose-400">
                High Churn Risk 🔴
              </span>
            </div>

            {/* Persona 3 */}
            <div className="flex items-center justify-between rounded-xl bg-white/[0.02] p-2 border border-white/[0.04]">
              <div className="flex items-center gap-2">
                <div className="grid h-6.5 w-6.5 place-items-center rounded bg-amber-500/10 text-amber-400">
                  <User className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-200">Marcus Vance</p>
                  <p className="text-[8px] text-zinc-500">Head of Growth</p>
                </div>
              </div>
              <span className="rounded bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 text-[8px] font-semibold text-amber-500">
                Objection: Pricing 🟡
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative radial gradient behind mockup (SaaS glows) */}
      <div className="absolute -z-10 w-[350px] h-[350px] rounded-full bg-violet-500/15 blur-[100px] pointer-events-none" />
      <div className="absolute -z-10 w-[450px] h-[450px] rounded-full bg-blue-500/10 blur-[130px] pointer-events-none" />
    </div>
  );
}
