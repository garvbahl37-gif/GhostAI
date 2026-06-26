"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingDown, UserMinus, HelpCircle, LifeBuoy, Wrench, Wand2, Loader2, Copy, Check } from "lucide-react";
import type { ChurnRisk, RevenueLeak, SalesObjection, SupportGap, AutoFix } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { severityColor } from "@/lib/utils";

export interface FixContext {
  title?: string;
  category?: string;
  tone?: string;
}

/** Generative "Auto-Fix": calls Gemini to produce paste-ready copy/markup that
 *  overcomes a detected leak. Real generation, honest error on failure. */
function AutoFixPanel({ leak, context }: { leak: RevenueLeak; context?: FixContext }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState("");
  const [fix, setFix] = useState<AutoFix | null>(null);

  async function run() {
    if (fix) {
      setOpen((o) => !o);
      return;
    }
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/autofix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem: { title: leak.title, cause: leak.cause, fix: leak.fix },
          context: context ?? {},
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d?.error || "Auto-Fix failed");
      setFix(d);
      setOpen(true);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-3">
      <button
        onClick={run}
        disabled={loading}
        className="group inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 backdrop-blur transition hover:border-slate-300 hover:bg-slate-100 disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5 text-ghost-violet" />}
        {loading ? "Generating fix…" : fix ? (open ? "Hide auto-fix" : "Show auto-fix") : "Fix it with AI"}
      </button>
      {err && <p className="mt-1.5 text-xs text-ghost-rose">{err}</p>}

      {loading && <FixSkeleton />}

      {fix && open && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 space-y-3"
        >
          <p className="text-xs italic text-slate-500">{fix.rationale}</p>
          {fix.variants.map((v, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold">{v.heading}</p>
                <Badge variant="muted">{v.kind}</Badge>
              </div>

              {/* before -> after diff */}
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg border border-ghost-rose/20 bg-ghost-rose/[0.06] p-2">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-ghost-rose/80">Before</p>
                  <p className="text-xs text-slate-500 line-through decoration-ghost-rose/40">{leak.cause}</p>
                </div>
                <div className="rounded-lg border border-ghost-emerald/25 bg-ghost-emerald/[0.07] p-2">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-ghost-emerald/80">After</p>
                    <CopyButton text={v.copy} />
                  </div>
                  <p className="text-xs text-slate-900">{v.copy}</p>
                </div>
              </div>

              {v.html && (
                <div className="mt-2">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Paste-ready snippet</p>
                    <CopyButton text={v.html} label="Copy code" />
                  </div>
                  <pre className="max-h-40 overflow-auto rounded-lg bg-slate-100 p-2 text-[10px] leading-snug text-slate-600">
                    {v.html}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

/** Copy-to-clipboard with a brief confirmation. */
function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard blocked — no-op */
        }
      }}
      className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 transition hover:bg-slate-100"
    >
      {copied ? <Check className="h-3 w-3 text-ghost-emerald" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : label}
    </button>
  );
}

/** Skeleton shown while the AI generates the fix. */
function FixSkeleton() {
  return (
    <div className="mt-3 space-y-3">
      {[0, 1].map((i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200" />
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <div className="h-14 animate-pulse rounded-lg bg-slate-100" />
            <div className="h-14 animate-pulse rounded-lg bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

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

export function RevenueLeakCard({ leak, i, context }: { leak: RevenueLeak; i: number; context?: FixContext }) {
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
      <p className="mt-2 text-sm text-slate-600">{leak.cause}</p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-slate-50 p-2">
          <p className="font-mono text-lg font-bold text-ghost-rose">{leak.estConversionLoss}%</p>
          <p className="text-[10px] text-slate-500">conv. at risk</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-2">
          <p className="font-mono text-lg font-bold text-ghost-amber">{leak.affectedPct}%</p>
          <p className="text-[10px] text-slate-500">customers hit</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-2">
          <p className="font-mono text-lg font-bold text-ghost-cyan">{leak.estRevenueImpact}</p>
          <p className="text-[10px] text-slate-500">$ impact</p>
        </div>
      </div>
      <div className="mt-3 flex items-start gap-2 rounded-xl bg-ghost-emerald/10 p-2.5 text-xs text-ghost-emerald">
        <Wrench className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {leak.fix}
      </div>
      <AutoFixPanel leak={leak} context={context} />
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
            <p className="text-xs text-slate-500">{churn.category}</p>
          </div>
        </div>
        <span className="font-mono text-xl font-bold text-ghost-rose">{churn.riskPct}%</span>
      </div>
      <p className="mt-2 text-sm text-slate-600">{churn.reason}</p>
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
      <p className="mt-2 text-sm text-slate-600">{obj.impact}</p>
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
      <p className="mt-2 text-sm text-slate-600">{gap.risk}</p>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="mb-1 flex justify-between text-slate-500">
            <span>FAQ coverage</span>
            <span className="font-mono">{gap.faqCoverage}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-ghost-cyan" style={{ width: `${gap.faqCoverage}%` }} />
          </div>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-slate-500">
            <span>Doc quality</span>
            <span className="font-mono">{gap.docQuality}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-ghost-violet" style={{ width: `${gap.docQuality}%` }} />
          </div>
        </div>
      </div>
    </Shell>
  );
}
