"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Globe, Swords, Loader2, Zap, ChevronDown, ChevronUp } from "lucide-react";
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

  async function launch(targetUrl: string) {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: targetUrl,
          competitorUrl: competitorUrl || undefined,
          pricingUrl: pricingUrl || undefined,
          personaCount: count,
          currentPrice: currentPrice ? Number(currentPrice) : undefined,
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
        <p className="mt-2 max-w-xl text-muted-foreground">
          Drop in a website. Hundreds of AI customers will browse it, judge your pricing, ask hard questions, and reveal
          what's quietly costing you conversions — in about a minute.
        </p>
      </motion.div>

      <Card className="conic-border mt-8 bg-[#0a0a16]/70 p-6">
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
              <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
              <span className="text-xs text-muted-foreground">Try:</span>
              {SAMPLES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setUrl(s)}
                  className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-foreground/80 transition hover:bg-white/10"
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
                  className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                    count === c
                      ? "border-ghost-violet bg-ghost-violet/20 text-foreground"
                      : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground"
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
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
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
              variant="outline"
              size="lg"
              disabled={loading}
              onClick={() => {
                setUrl("stripe.com");
                launch("stripe.com");
              }}
            >
              <Zap className="h-4 w-4" /> Instant demo
            </Button>
          </div>
        </form>
      </Card>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a
          href="/arena"
          className="flex items-center gap-3 rounded-2xl glass p-4 transition hover:bg-white/[0.06]"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-ghost-amber/15 text-ghost-amber">
            <Swords className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">Competitor Battle Arena</p>
            <p className="text-xs text-muted-foreground">Pit your site against a rival</p>
          </div>
        </a>
        <a
          href="/pricing-lab"
          className="flex items-center gap-3 rounded-2xl glass p-4 transition hover:bg-white/[0.06]"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-ghost-emerald/15 text-ghost-emerald">
            <Zap className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">Pricing Time Machine</p>
            <p className="text-xs text-muted-foreground">Simulate a price change</p>
          </div>
        </a>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Runs instantly on the deterministic demo engine. Add a <span className="text-foreground">GEMINI_API_KEY</span> for live AI analysis.
      </p>
    </div>
    </AuthGate>
  );
}
