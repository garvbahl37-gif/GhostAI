"use client";

import { motion } from "framer-motion";
import { Users, Cpu, ShieldAlert, Rocket, ShieldCheck, Check, Lock } from "lucide-react";
import { AnimatedNumber } from "@/components/shared/animated-number";

export function TrustSection() {
  const stats = [
    {
      icon: Users,
      value: 840,
      suffix: "K+",
      decimals: 0,
      label: "Customer Simulations Runs",
      desc: "Ghost agents deployed to evaluate customer funnels",
      color: "text-violet-400",
      bgColor: "bg-violet-500/5 border-violet-500/10",
    },
    {
      icon: Cpu,
      value: 1.8,
      suffix: "M+",
      decimals: 1,
      label: "AI Predictions Generated",
      desc: "Intent, clarity, and objection metrics analyzed",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/5 border-cyan-500/10",
    },
    {
      icon: ShieldAlert,
      value: 12.4,
      suffix: "K+",
      decimals: 1,
      label: "Churn Risks Identified",
      desc: "Pre-launch friction and customer drop-off points caught",
      color: "text-rose-400",
      bgColor: "bg-rose-500/5 border-rose-500/10",
    },
    {
      icon: Rocket,
      value: 3.2,
      suffix: "K+",
      decimals: 1,
      label: "Product Launches Analyzed",
      desc: "High-value SaaS releases stress-tested",
      color: "text-amber-400",
      bgColor: "bg-amber-500/5 border-amber-500/10",
    },
  ];

  const badges = [
    { label: "SOC2 Type II", info: "Certified Compliance", icon: ShieldCheck },
    { label: "GDPR Compliant", info: "Complete Data Privacy", icon: Check },
    { label: "AES-256", info: "Enterprise Encryption", icon: Lock },
    { label: "ISO 27001", info: "Security Standard", icon: ShieldCheck },
  ];

  return (
    <section className="relative border-t border-b border-slate-900/[0.04] bg-slate-50/60 py-16 backdrop-blur-md">
      {/* Subtle backdrop grid */}
      <div className="absolute inset-0 -z-10 bg-grid-bg opacity-[0.02] pointer-events-none" />

      <div className="container max-w-6xl">
        {/* Header Title */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-[0.25em] bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent"
          >
            SaaS Credibility &amp; Trust Core
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            Pre-launch simulation at global scale
          </motion.h2>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-violet-200/60 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <span className={`grid h-10 w-10 place-items-center rounded-xl border ${s.bgColor} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className={`h-5 w-5 ${s.color}`} />
                  </span>
                  <span className="font-mono text-2xl font-bold text-slate-900 tracking-tight">
                    <AnimatedNumber value={s.value} suffix={s.suffix} decimals={s.decimals} />
                  </span>
                </div>
                <h3 className="mt-4 text-sm font-semibold text-slate-800 group-hover:text-violet-600 transition-colors">
                  {s.label}
                </h3>
                <p className="mt-1.5 text-xs leading-normal text-slate-500">
                  {s.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Security Credentials Bar */}
        <div className="mt-14 pt-10 border-t border-slate-200/70 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Enterprise Security Core:
          </span>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            {badges.map((b, idx) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.label}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 + 0.3 }}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4 text-violet-400/80" />
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-slate-800">{b.label}</span>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider">{b.info}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
