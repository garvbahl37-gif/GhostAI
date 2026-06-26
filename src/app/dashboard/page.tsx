"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Globe, Swords, Loader2, Zap, ChevronDown, ChevronUp, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AuthGate } from "@/components/auth/auth-gate";

const SAMPLES = ["stripe.com", "notion.so", "linear.app", "vercel.com", "figma.com"];
const COUNTS = [60, 120, 250, 500];

export default function DashboardPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [competitorUrl, setCompetitor] = useState("");
  const [pricingUrl, setPricing] = useState("");
  const [currentPrice, setPrice] = useState("");
  const [count, setCount] = useState(120);
  const [advanced, setAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function launch(targetUrl: string, opts?: { isDemo?: boolean }) {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: targetUrl,
          competitorUrl: opts?.isDemo ? undefined : competitorUrl || undefined,
          pricingUrl: opts?.isDemo ? undefined : pricingUrl || undefined,
          personaCount: opts?.isDemo ? 250 : count,
          currentPrice: opts?.isDemo ? undefined : currentPrice ? Number(currentPrice) : undefined,
          isDemo: opts?.isDemo || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create run");
      sessionStorage.setItem(`ghost:pending:${data.runId}`, JSON.stringify(data.config));
      router.push(`/simulation/${data.runId}`);
    } catch (e) {
      setError((e as Error).message);
      setLoading(false);
    }
  }

  return (
    <AuthGate subtitle="Create a free account or sign in to launch the customer swarm, run UI Roasts, and save your reports.">
    <div className="container max-w-3xl py-28">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Badge variant="cyan" className="mb-4">
          <Sparkles className="h-3 w-3" /> New simulation
        </Badge>
        <h1 className="text-3xl font-bold sm:text-4xl">
          Unleash the <span className="gradient-text">customer swarm</span>
        </h1>
        <p className="mt-2 max-w-xl text-slate-500">
          Drop in a website. Hundreds of AI customers will browse it, judge your pricing, ask hard questions, and reveal
          what's quietly costing you conversions — in about a minute.
        </p>
      </motion.div>

      <Card className="conic-border mt-8 bg-white p-7">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (url.trim()) launch(url.trim());
          }}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="url">Website URL</Label>
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="yourcompany.com"
                className="pl-10"
                autoFocus
              />
            </div>
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs text-slate-500">Try:</span>
              {SAMPLES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setUrl(s)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-500 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Customer swarm size</Label>
            <div className="flex flex-wrap gap-2">
              {COUNTS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCount(c)}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                    count === c
                      ? "border-slate-300 bg-slate-100 text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_6px_18px_-8px_rgba(30,20,70,0.12)]"
                      : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {c} ghosts
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAdvanced((v) => !v)}
            className="flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-900"
          >
            {advanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            Advanced options
          </button>

          {advanced && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="comp">Competitor URL (for Arena)</Label>
                <Input id="comp" value={competitorUrl} onChange={(e) => setCompetitor(e.target.value)} placeholder="competitor.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricing">Pricing page URL</Label>
                <Input id="pricing" value={pricingUrl} onChange={(e) => setPricing(e.target.value)} placeholder="yourcompany.com/pricing" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Current price ($/mo)</Label>
                <Input id="price" type="number" value={currentPrice} onChange={(e) => setPrice(e.target.value)} placeholder="29" />
              </div>
            </motion.div>
          )}

          {error && <p className="text-sm text-ghost-rose">{error}</p>}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" size="lg" disabled={loading || !url.trim()} className="flex-1">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? "Launching swarm…" : "Run simulation"}
            </Button>
            <Button
              type="button"
              variant="accent"
              size="lg"
              disabled={loading}
              onClick={() => launch("stripe.com", { isDemo: true })}
              title="Bulletproof offline demo — seeded Stripe data, no network needed"
            >
              <Zap className="h-4 w-4" /> Speed Run Demo
            </Button>
          </div>
        </form>
      </Card>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a
          href="/arena"
          className="group flex items-center gap-3 rounded-2xl border border-slate-200 glass p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-100"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ghost-amber/15 text-ghost-amber ring-1 ring-ghost-amber/20">
            <Swords className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Competitor Battle Arena</p>
            <p className="text-xs text-slate-500">Pit your site against a rival</p>
          </div>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-500 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-900" />
        </a>
        <a
          href="/pricing-lab"
          className="group flex items-center gap-3 rounded-2xl border border-slate-200 glass p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-100"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ghost-emerald/15 text-ghost-emerald ring-1 ring-ghost-emerald/20">
            <Zap className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Pricing Time Machine</p>
            <p className="text-xs text-slate-500">Simulate a price change</p>
          </div>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-500 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-900" />
        </a>
      </div>
    </div>
    </AuthGate>
  );
}
