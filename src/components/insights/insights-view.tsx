"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Loader2, Swords, Zap } from "lucide-react";
import type { RunState } from "@/lib/types";
import { fetchRun } from "@/lib/client/cache";
import { hostOf } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AnimatedNumber } from "@/components/shared/animated-number";
import { VerdictDonut, RoleBar, ConfusionRadar, RiskGauge } from "./charts";
import { Heatmap } from "./heatmap";
import { RevenueLeakCard, ChurnCard, ObjectionCard, SupportGapCard } from "./risk-cards";
import { PersonaCard } from "@/components/persona/persona-card";
import { BrandedSpinner } from "@/components/shared/cinematic-loader";

function Metric({ label, value, suffix, color }: { label: string; value: number; suffix?: string; color: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 font-mono text-2xl font-bold" style={{ color }}>
          <AnimatedNumber value={value} suffix={suffix} />
        </p>
      </CardContent>
    </Card>
  );
}

export function InsightsView({ runId }: { runId: string }) {
  const [run, setRun] = useState<RunState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRun(runId).then((r) => {
      setRun(r);
      setLoading(false);
    });
  }, [runId]);

  if (loading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-28">
        <BrandedSpinner label="Loading customer intelligence…" />
      </div>
    );
  }

  if (!run?.insights) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-28 text-center">
        <p className="text-lg font-semibold">No insights found for this run.</p>
        <p className="max-w-md text-sm text-muted-foreground">
          The run may have expired from the demo cache. Start a fresh simulation to generate insights.
        </p>
        <Link href="/dashboard">
          <Button>Run a new simulation</Button>
        </Link>
      </div>
    );
  }

  const ins = run.insights;
  const analysis = run.analysis;
  const personasWithSims = run.personas.map((p) => ({
    persona: p,
    sim: run.simulations.find((s) => s.personaId === p.id),
  }));

  return (
    <div className="container max-w-7xl py-24">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge variant="cyan" className="mb-3">
            Customer Intelligence Report
          </Badge>
          <h1 className="text-2xl font-bold sm:text-3xl">
            {analysis?.title ?? hostOf(run.config.url)}
            {analysis && <span className="ml-2 text-base font-normal text-muted-foreground">{analysis.category}</span>}
          </h1>
          <p className="mt-1 max-w-2xl text-slate-600">{ins.headline}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/report/${runId}`}>
            <Button variant="accent">
              <FileText className="h-4 w-4" /> Executive report
            </Button>
          </Link>
          <Link href={`/simulation/${runId}`}>
            <Button variant="outline">Replay run</Button>
          </Link>
        </div>
      </div>

      {/* Metric tiles */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric label="Avg purchase intent" value={ins.avgPurchaseProbability} suffix="%" color="#0f172a" />
        <Metric label="Avg confusion" value={ins.avgConfusion} suffix="%" color="#475569" />
        <Metric label="Avg churn risk" value={ins.avgChurnRisk} suffix="%" color="#64748b" />
        <Metric label="Est. conversion uplift" value={ins.estConversionUplift} suffix="%" color="#334155" />
      </div>

      {/* Charts row */}
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Verdict breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <VerdictDonut data={ins.verdictBreakdown} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Conversion risk</CardTitle>
          </CardHeader>
          <CardContent>
            <RiskGauge value={ins.conversionRiskScore} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Confusion radar</CardTitle>
          </CardHeader>
          <CardContent>
            <ConfusionRadar zones={ins.heatmap} />
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Purchase intent by segment</CardTitle>
        </CardHeader>
        <CardContent>
          <RoleBar data={ins.roleBreakdown} />
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="revenue">
        <TabsList className="flex-wrap">
          <TabsTrigger value="revenue">Revenue leaks ({ins.revenueLeaks.length})</TabsTrigger>
          <TabsTrigger value="churn">Churn ({ins.churnRisks.length})</TabsTrigger>
          <TabsTrigger value="sales">Sales & support</TabsTrigger>
          <TabsTrigger value="heatmap">Confusion heatmap</TabsTrigger>
          <TabsTrigger value="personas">Personas</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          {ins.revenueLeaks.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {ins.revenueLeaks.map((l, i) => (
                <RevenueLeakCard
                  key={l.title}
                  leak={l}
                  i={i}
                  context={{ title: analysis?.title, category: analysis?.category, tone: analysis?.toneOfVoice }}
                />
              ))}
            </div>
          ) : (
            <Empty>No major revenue leaks detected — nice.</Empty>
          )}
        </TabsContent>

        <TabsContent value="churn">
          {ins.churnRisks.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {ins.churnRisks.map((c, i) => (
                <ChurnCard key={c.segment + i} churn={c} i={i} />
              ))}
            </div>
          ) : (
            <Empty>No high-churn segments detected.</Empty>
          )}
        </TabsContent>

        <TabsContent value="sales">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Unanswered buying questions</h3>
              <div className="space-y-4">
                {ins.salesObjections.map((o, i) => (
                  <ObjectionCard key={o.question} obj={o} i={i} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Support stress test</h3>
              <div className="space-y-4">
                {ins.supportGaps.map((g, i) => (
                  <SupportGapCard key={g.scenario} gap={g} i={i} />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="heatmap">
          <Heatmap zones={ins.heatmap} />
          <div className="mt-6 rounded-2xl glass p-5">
            <h3 className="mb-3 text-sm font-semibold">Top questions customers asked</h3>
            <div className="flex flex-wrap gap-2">
              {ins.topQuestions.map((q) => (
                <span key={q} className="rounded-full bg-slate-50 px-3 py-1.5 text-sm text-slate-600">
                  {q}
                </span>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="personas">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {personasWithSims.slice(0, 60).map(({ persona, sim }, i) => (
              <PersonaCard key={persona.id} persona={persona} sim={sim} index={i} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-8 grid gap-3 sm:grid-cols-3"
      >
        <Link href={`/report/${runId}`} className="flex items-center gap-3 rounded-2xl glass p-4 transition hover:bg-slate-100">
          <FileText className="h-5 w-5 text-ghost-cyan" />
          <span className="text-sm font-semibold">Executive report</span>
          <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
        </Link>
        <Link href="/arena" className="flex items-center gap-3 rounded-2xl glass p-4 transition hover:bg-slate-100">
          <Swords className="h-5 w-5 text-ghost-amber" />
          <span className="text-sm font-semibold">Battle a competitor</span>
          <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
        </Link>
        <Link href="/pricing-lab" className="flex items-center gap-3 rounded-2xl glass p-4 transition hover:bg-slate-100">
          <Zap className="h-5 w-5 text-ghost-emerald" />
          <span className="text-sm font-semibold">Simulate a price change</span>
          <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
        </Link>
      </motion.div>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl glass p-10 text-center text-sm text-muted-foreground">{children}</div>;
}
