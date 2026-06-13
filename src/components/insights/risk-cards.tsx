"use client";

import { motion } from "framer-motion";
import { TrendingDown, UserMinus, HelpCircle, LifeBuoy, Wrench } from "lucide-react";
import type { ChurnRisk, RevenueLeak, SalesObjection, SupportGap } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { severityColor } from "@/lib/utils";

function SeverityBadge({ s }: { s: string }) {
  const variant = s === "critical" ? "rose" : s === "high" ? "amber" : s === "medium" ? "cyan" : "emerald";
  return (
    <Badge variant={variant as any} className="capitalize">
      {s}
    </Badge>
  );
}

function Shell({ children, i }: { children: React.ReactNode; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.05 }}
      className="rounded-2xl glass p-4"
    >
      {children}
    </motion.div>
  );
}

export function RevenueLeakCard({ leak, i }: { leak: RevenueLeak; i: number }) {
  return (
    <Shell i={i}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: `${severityColor(leak.severity)}22`, color: severityColor(leak.severity) }}>
            <TrendingDown className="h-4 w-4" />
          </span>
          <p className="font-semibold">{leak.title}</p>
        </div>
        <SeverityBadge s={leak.severity} />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{leak.cause}</p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-white/[0.03] p-2">
          <p className="font-mono text-lg font-bold text-ghost-rose">{leak.estConversionLoss}%</p>
          <p className="text-[10px] text-muted-foreground">conv. at risk</p>
        </div>
        <div className="rounded-xl bg-white/[0.03] p-2">
          <p className="font-mono text-lg font-bold text-ghost-amber">{leak.affectedPct}%</p>
          <p className="text-[10px] text-muted-foreground">customers hit</p>
        </div>
        <div className="rounded-xl bg-white/[0.03] p-2">
          <p className="font-mono text-lg font-bold text-ghost-cyan">{leak.estRevenueImpact}</p>
          <p className="text-[10px] text-muted-foreground">$ impact</p>
        </div>
      </div>
      <div className="mt-3 flex items-start gap-2 rounded-xl bg-ghost-emerald/10 p-2.5 text-xs text-ghost-emerald">
        <Wrench className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {leak.fix}
      </div>
    </Shell>
  );
}

export function ChurnCard({ churn, i }: { churn: ChurnRisk; i: number }) {
  return (
    <Shell i={i}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-ghost-rose/15 text-ghost-rose">
            <UserMinus className="h-4 w-4" />
          </span>
          <div>
            <p className="font-semibold">{churn.segment}</p>
            <p className="text-xs text-muted-foreground">{churn.category}</p>
          </div>
        </div>
        <span className="font-mono text-xl font-bold text-ghost-rose">{churn.riskPct}%</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{churn.reason}</p>
      <div className="mt-3 flex items-start gap-2 rounded-xl bg-ghost-emerald/10 p-2.5 text-xs text-ghost-emerald">
        <Wrench className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {churn.fix}
      </div>
    </Shell>
  );
}

export function ObjectionCard({ obj, i }: { obj: SalesObjection; i: number }) {
  return (
    <Shell i={i}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-ghost-amber" />
          <p className="font-semibold">“{obj.question}”</p>
        </div>
        <SeverityBadge s={obj.severity} />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{obj.impact}</p>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <Badge variant={obj.answeredOnSite ? "emerald" : "rose"}>
          {obj.answeredOnSite ? "Answered on site" : "Not answered"}
        </Badge>
        {obj.affectedRoles.slice(0, 3).map((r) => (
          <Badge key={r} variant="muted">
            {r}
          </Badge>
        ))}
      </div>
    </Shell>
  );
}

export function SupportGapCard({ gap, i }: { gap: SupportGap; i: number }) {
  return (
    <Shell i={i}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <LifeBuoy className="h-4 w-4 text-ghost-cyan" />
          <p className="font-semibold">{gap.scenario}</p>
        </div>
        <SeverityBadge s={gap.severity} />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{gap.risk}</p>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="mb-1 flex justify-between text-muted-foreground">
            <span>FAQ coverage</span>
            <span className="font-mono">{gap.faqCoverage}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-ghost-cyan" style={{ width: `${gap.faqCoverage}%` }} />
          </div>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-muted-foreground">
            <span>Doc quality</span>
            <span className="font-mono">{gap.docQuality}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-ghost-violet" style={{ width: `${gap.docQuality}%` }} />
          </div>
        </div>
      </div>
    </Shell>
  );
}
