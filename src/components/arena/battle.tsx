"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Crown, Loader2, Swords } from "lucide-react";
import type { CompetitorAnalysis } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Battle() {
  const [you, setYou] = useState("");
  const [comp, setComp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CompetitorAnalysis | null>(null);

  async function battle() {
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/competitor-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: you, competitorUrl: comp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Battle failed");
      setResult(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const radarData = result?.dimensions.map((d) => ({ dim: d.name, You: d.you, Competitor: d.competitor })) ?? [];

  return (
    <div className="container max-w-5xl py-28">
      <div className="mb-8 text-center">
        <Badge variant="amber" className="mb-3">
          <Swords className="h-3 w-3" /> Competitor Battle Arena
        </Badge>
        <h1 className="text-3xl font-bold sm:text-4xl">
          Whose customers <span className="gradient-text">convert better?</span>
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
          Send the swarm to both sites and watch which experience wins each customer segment.
        </p>
      </div>

      <Card className="mb-8 p-6">
        <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
          <div className="space-y-2">
            <Label>Your site</Label>
            <Input value={you} onChange={(e) => setYou(e.target.value)} placeholder="yourcompany.com" />
          </div>
          <div className="grid h-12 w-12 place-items-center self-end rounded-full bg-ghost-rose/15 text-ghost-rose max-sm:mx-auto">
            VS
          </div>
          <div className="space-y-2">
            <Label>Competitor</Label>
            <Input value={comp} onChange={(e) => setComp(e.target.value)} placeholder="competitor.com" />
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-ghost-rose">{error}</p>}
        <Button onClick={battle} disabled={loading || !you.trim() || !comp.trim()} size="lg" className="mt-4 w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Swords className="h-4 w-4" />}
          {loading ? "Battling…" : "Start the battle"}
        </Button>
      </Card>

      {result && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Scoreboard */}
          <div className="grid items-stretch gap-4 sm:grid-cols-[1fr_auto_1fr]">
            <Combatant side="you" name={result.you.title} url={result.you.url} score={result.you.score} winner={result.winner === "you"} />
            <div className="grid place-items-center">
              <span className="font-mono text-2xl font-bold text-muted-foreground">VS</span>
            </div>
            <Combatant
              side="competitor"
              name={result.competitor.title}
              url={result.competitor.url}
              score={result.competitor.score}
              winner={result.winner === "competitor"}
            />
          </div>

          <div className="rounded-2xl glass p-5 text-center">
            <p className="text-sm text-muted-foreground">Verdict</p>
            <p className="mt-1 text-lg font-semibold">
              {result.winner === "tie" ? "It's a tie — segments are split." : `${result.winner === "you" ? result.you.title : result.competitor.title} wins.`}{" "}
              <span className="text-foreground/70">{result.reason}</span>
            </p>
          </div>

          {/* Radar + dimensions */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardContent className="p-5">
                <p className="mb-2 text-sm font-semibold">Head-to-head dimensions</p>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} outerRadius="70%">
                      <PolarGrid stroke="rgba(255,255,255,0.12)" />
                      <PolarAngleAxis dataKey="dim" tick={{ fill: "#cbd5e1", fontSize: 10 }} />
                      <Radar dataKey="You" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.3} />
                      <Radar dataKey="Competitor" stroke="#fb7185" fill="#fb7185" fillOpacity={0.25} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{ background: "rgba(15,15,25,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3 p-5">
                <p className="text-sm font-semibold">Dimension breakdown</p>
                {result.dimensions.map((d) => (
                  <div key={d.name}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{d.name}</span>
                      <span className="font-mono">
                        <span className="text-ghost-cyan">{d.you}</span>
                        {" / "}
                        <span className="text-ghost-rose">{d.competitor}</span>
                      </span>
                    </div>
                    <div className="flex h-2 overflow-hidden rounded-full bg-white/5">
                      <div className="bg-ghost-cyan" style={{ width: `${d.you / 2}%` }} />
                      <div className="ml-auto bg-ghost-rose" style={{ width: `${d.competitor / 2}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Persona preferences */}
          <Card>
            <CardContent className="p-5">
              <p className="mb-3 text-sm font-semibold">Which customer prefers whom</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {result.personaPreferences.map((p) => (
                  <div key={p.role} className="flex items-start gap-3 rounded-xl bg-white/[0.03] p-3">
                    <Badge variant={p.prefers === "you" ? "cyan" : "rose"}>{p.prefers === "you" ? "You" : "Rival"}</Badge>
                    <div>
                      <p className="text-sm font-medium">{p.role}</p>
                      <p className="text-xs text-muted-foreground">{p.why}</p>
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

function Combatant({
  side,
  name,
  url,
  score,
  winner,
}: {
  side: "you" | "competitor";
  name: string;
  url: string;
  score: number;
  winner: boolean;
}) {
  const color = side === "you" ? "#22d3ee" : "#fb7185";
  return (
    <div
      className="relative overflow-hidden rounded-2xl glass p-5 text-center"
      style={{ boxShadow: winner ? `0 0 0 1px ${color}, 0 20px 50px -20px ${color}` : undefined }}
    >
      {winner && (
        <div className="absolute right-3 top-3 text-ghost-amber">
          <Crown className="h-5 w-5" />
        </div>
      )}
      <p className="truncate text-lg font-bold">{name}</p>
      <p className="truncate text-xs text-muted-foreground">{url.replace(/^https?:\/\//, "")}</p>
      <p className="mt-3 font-mono text-5xl font-bold" style={{ color }}>
        {score}
      </p>
      <p className="text-xs text-muted-foreground">experience score</p>
    </div>
  );
}
