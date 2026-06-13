"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import { Loader2, TrendingUp, TrendingDown, Sparkles, ArrowRight } from "lucide-react";
import type { PricingSimulation } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedNumber } from "@/components/shared/animated-number";

function Delta({ label, value, suffix, goodWhenPositive = true }: { label: string; value: number; suffix: string; goodWhenPositive?: boolean }) {
  const positive = value >= 0;
  const good = goodWhenPositive ? positive : !positive;
  const color = good ? "#34d399" : "#fb7185";
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 flex items-center gap-1 font-mono text-2xl font-bold" style={{ color }}>
          {positive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          {positive ? "+" : ""}
          <AnimatedNumber value={value} suffix={suffix} />
        </p>
      </CardContent>
    </Card>
  );
}

export function PricingLab() {
  const [current, setCurrent] = useState("29");
  const [proposed, setProposed] = useState("49");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<PricingSimulation | null>(null);

  async function simulate() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/pricing-simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPrice: Number(current), proposedPrice: Number(proposed) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Simulation failed");
      setResult(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container max-w-5xl py-28">
      <div className="mb-8 text-center">
        <Badge variant="emerald" className="mb-3">
          <Sparkles className="h-3 w-3" /> Pricing Time Machine
        </Badge>
        <h1 className="text-3xl font-bold sm:text-4xl">
          Change your price. <span className="gradient-text">See the future.</span>
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
          Simulate how every customer segment reacts to a price change — before you risk a single real customer.
        </p>
      </div>

      <Card className="mb-8 p-6">
        <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr_auto]">
          <div className="space-y-2">
            <Label>Current price ($/mo)</Label>
            <Input type="number" value={current} onChange={(e) => setCurrent(e.target.value)} />
          </div>
          <ArrowRight className="mb-3 h-5 w-5 self-end justify-self-center text-muted-foreground max-sm:hidden" />
          <div className="space-y-2">
            <Label>Proposed price ($/mo)</Label>
            <Input type="number" value={proposed} onChange={(e) => setProposed(e.target.value)} />
          </div>
          <Button onClick={simulate} disabled={loading} size="lg" className="max-sm:mt-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Simulate
          </Button>
        </div>
        {error && <p className="mt-3 text-sm text-ghost-rose">{error}</p>}
      </Card>

      {result && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Delta label="Conversion change" value={result.expectedConversionChange} suffix="%" />
            <Delta label="Revenue change" value={result.expectedRevenueChange} suffix="%" />
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Revenue-optimal price</p>
                <p className="mt-1 font-mono text-2xl font-bold text-ghost-cyan">
                  $<AnimatedNumber value={result.optimalPrice} />
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-ghost-violet/15 to-ghost-cyan/10 p-5 ring-1 ring-white/10">
            <p className="text-sm font-semibold text-ghost-cyan">Recommendation</p>
            <p className="mt-1 text-foreground/90">{result.recommendation}</p>
          </div>

          <Card>
            <CardContent className="p-5">
              <p className="mb-3 text-sm font-semibold">Price elasticity curve</p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={result.curve} margin={{ left: -10, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="price" tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                    <YAxis yAxisId="left" tick={{ fill: "#94a3b8", fontSize: 11 }} domain={[0, 100]} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ background: "rgba(15,15,25,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
                      labelFormatter={(v) => `Price: $${v}`}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <ReferenceLine x={result.proposedPrice} yAxisId="left" stroke="#fbbf24" strokeDasharray="4 4" label={{ value: "proposed", fill: "#fbbf24", fontSize: 10 }} />
                    <ReferenceLine x={result.optimalPrice} yAxisId="left" stroke="#22d3ee" strokeDasharray="4 4" label={{ value: "optimal", fill: "#22d3ee", fontSize: 10 }} />
                    <Line yAxisId="left" type="monotone" dataKey="conversion" name="Conversion %" stroke="#34d399" strokeWidth={2} dot={false} />
                    <Line yAxisId="right" type="monotone" dataKey="revenueIndex" name="Revenue index" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <p className="mb-3 text-sm font-semibold">How each segment reacts</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {result.segmentReactions.map((s) => (
                  <div key={s.role} className="flex items-start gap-3 rounded-xl bg-white/[0.03] p-3">
                    <Badge variant={s.willChurn ? "rose" : "emerald"}>{s.willChurn ? "Will churn" : "Stays"}</Badge>
                    <div>
                      <p className="text-sm font-medium">{s.role}</p>
                      <p className="text-xs text-muted-foreground">{s.reaction}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
