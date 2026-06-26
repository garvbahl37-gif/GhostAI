"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { ArrowRight, BarChart3, FileText, Loader2, Swords, Zap } from "lucide-react";
import type {
  Insights,
  Persona,
  RevenueLeak,
  RunConfig,
  RunEvent,
  RunPhase,
  RunState,
  SalesObjection,
  SimulationResult,
  WebsiteAnalysis,
  ExecutiveReport,
} from "@/lib/types";
import { streamRun } from "@/lib/client/run-client";
import { saveRunCache, loadRunCache } from "@/lib/client/cache";
import { hostOf } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PhaseRail } from "./phase-rail";
import { AgentStream, type Thought } from "./agent-stream";
import { SwarmGrid } from "./swarm-grid";
import { MetricTicker } from "./metric-ticker";
import { SimFeed, Discoveries } from "./live-feed";
import { ReactionBoard } from "./reaction-board";
import { CinematicLoader } from "@/components/shared/cinematic-loader";

interface State {
  status: "idle" | "running" | "done" | "error";
  phase: RunPhase;
  progress: number;
  message: string;
  error?: string;
  analysis?: WebsiteAnalysis;
  personas: Persona[];
  personaIds: Record<string, true>;
  sims: SimulationResult[];
  simsById: Record<string, SimulationResult>;
  thoughts: Thought[];
  seq: number;
  total: number;
  metrics: { simulated: number; avgPurchase: number; avgConfusion: number; conversionRisk: number; estUplift: number };
  leaks: RevenueLeak[];
  objections: SalesObjection[];
  insights?: Insights;
  report?: ExecutiveReport;
}

const initial: State = {
  status: "idle",
  phase: "queued",
  progress: 0,
  message: "Initializing…",
  personas: [],
  personaIds: {},
  sims: [],
  simsById: {},
  thoughts: [],
  seq: 0,
  total: 0,
  metrics: { simulated: 0, avgPurchase: 0, avgConfusion: 0, conversionRisk: 0, estUplift: 0 },
  leaks: [],
  objections: [],
};

type Action = { type: "start" } | { type: "event"; e: RunEvent | { type: "init"; runId: string } };

function reducer(s: State, action: Action): State {
  if (action.type === "start") return { ...initial, status: "running" };
  const e = action.e;
  switch (e.type) {
    case "status":
      return { ...s, phase: e.phase, progress: e.progress, message: e.message };
    case "analysis":
      return { ...s, analysis: e.data };
    case "persona":
      if (s.personaIds[e.data.id]) return { ...s, total: e.total };
      return {
        ...s,
        total: e.total,
        personas: [...s.personas, e.data],
        personaIds: { ...s.personaIds, [e.data.id]: true },
      };
    case "thought":
      return {
        ...s,
        seq: s.seq + 1,
        thoughts: [{ id: s.seq, agent: e.agent, text: e.text }, ...s.thoughts].slice(0, 50),
      };
    case "simulation":
      if (s.simsById[e.data.personaId]) return s;
      return {
        ...s,
        sims: [...s.sims, e.data],
        simsById: { ...s.simsById, [e.data.personaId]: e.data },
      };
    case "metric":
      return { ...s, metrics: { ...s.metrics, [e.key]: e.value } };
    case "leak":
      if (s.leaks.some((l) => l.title === e.data.title)) return s;
      return { ...s, leaks: [...s.leaks, e.data] };
    case "objection":
      if (s.objections.some((o) => o.question === e.data.question)) return s;
      return { ...s, objections: [...s.objections, e.data] };
    case "insights":
      return { ...s, insights: e.data };
    case "report":
      return { ...s, report: e.data };
    case "done":
      return { ...s, status: "done", phase: "done", progress: 100 };
    case "error":
      return { ...s, status: "error", error: e.message };
    default:
      return s;
  }
}

export function WarRoom({ runId }: { runId: string }) {
  const router = useRouter();
  const [s, dispatch] = useReducer(reducer, initial);
  const started = useRef(false);
  const configRef = useRef<RunConfig | null>(null);

  // Cinematic boot overlay: hold for a beat, then reveal once the swarm exists.
  const [showLoader, setShowLoader] = useState(true);
  const latest = useRef(s);
  latest.current = s;
  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const st = latest.current;
      const elapsed = Date.now() - start;
      const ready = st.personas.length >= 8 || st.status === "done" || st.status === "error";
      if ((ready && elapsed > 2600) || elapsed > 8000) {
        setShowLoader(false);
        clearInterval(id);
      }
    }, 250);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    // 1. pending config from the dashboard
    let config: RunConfig | null = null;
    try {
      const raw = sessionStorage.getItem(`ghost:pending:${runId}`);
      if (raw) config = JSON.parse(raw);
    } catch {
      /* noop */
    }

    // 2. already-completed cached run → replay summary instantly
    if (!config) {
      const cached = loadRunCache(runId);
      if (cached?.phase === "done") {
        hydrateFromCache(cached);
        return;
      }
      // nothing to do here
      router.replace("/dashboard");
      return;
    }

    configRef.current = config;
    dispatch({ type: "start" });
    const controller = new AbortController();
    streamRun({ runId, ...config }, (e) => dispatch({ type: "event", e }), controller.signal).catch((err) => {
      dispatch({ type: "event", e: { type: "error", message: (err as Error).message } });
    });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId]);

  // persist to cache when finished
  useEffect(() => {
    if (s.status !== "done" || !configRef.current) return;
    const run: RunState = {
      runId,
      config: configRef.current,
      phase: "done",
      createdAt: Date.now(),
      analysis: s.analysis,
      personas: s.personas,
      simulations: s.sims,
      insights: s.insights,
      report: s.report,
      engine: s.analysis?.source === "mock" ? "mock" : "gemini",
    };
    saveRunCache(run);
  }, [s.status]); // eslint-disable-line react-hooks/exhaustive-deps

  function hydrateFromCache(cached: RunState) {
    configRef.current = cached.config;
    dispatch({ type: "start" });
    if (cached.analysis) dispatch({ type: "event", e: { type: "analysis", data: cached.analysis } });
    cached.personas.forEach((p, i) =>
      dispatch({ type: "event", e: { type: "persona", data: p, index: i, total: cached.config.personaCount } }),
    );
    cached.simulations.forEach((sim) => dispatch({ type: "event", e: { type: "simulation", data: sim } }));
    cached.insights?.revenueLeaks.forEach((l) => dispatch({ type: "event", e: { type: "leak", data: l } }));
    cached.insights?.salesObjections
      .filter((o) => !o.answeredOnSite)
      .forEach((o) => dispatch({ type: "event", e: { type: "objection", data: o } }));
    if (cached.insights) {
      dispatch({ type: "event", e: { type: "metric", key: "avgPurchase", value: cached.insights.avgPurchaseProbability } });
      dispatch({ type: "event", e: { type: "metric", key: "avgConfusion", value: cached.insights.avgConfusion } });
      dispatch({ type: "event", e: { type: "metric", key: "conversionRisk", value: cached.insights.conversionRiskScore } });
      dispatch({ type: "event", e: { type: "metric", key: "simulated", value: cached.config.personaCount } });
      dispatch({ type: "event", e: { type: "insights", data: cached.insights } });
    }
    if (cached.report) dispatch({ type: "event", e: { type: "report", data: cached.report } });
    dispatch({ type: "event", e: { type: "done", runId } });
  }

  const host = configRef.current ? hostOf(configRef.current.url) : "";
  const done = s.status === "done";

  return (
    <>
      <AnimatePresence>
        {showLoader && <CinematicLoader progress={s.progress} label={s.message} />}
      </AnimatePresence>

      <div className="container max-w-7xl py-24">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold sm:text-3xl">AI War Room</h1>
              {configRef.current?.isDemo && (
                <Badge variant="amber">
                  <Zap className="h-3 w-3" /> Demo Mode Active
                </Badge>
              )}
              {s.status === "running" && (
                <Badge variant="cyan">
                  <Loader2 className="h-3 w-3 animate-spin" /> Live
                </Badge>
              )}
              {done && <Badge variant="emerald">Complete</Badge>}
              {s.status === "error" && <Badge variant="rose">Error</Badge>}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {host ? <>Simulating customers for <span className="font-mono text-foreground">{host}</span></> : "Customer simulation"}
              {s.analysis && <> · {s.analysis.category}</>}
            </p>
          </div>
          {done && (
            <div className="flex flex-wrap gap-2">
              <Link href={`/insights/${runId}`}>
                <Button variant="accent">
                  <BarChart3 className="h-4 w-4" /> View insights
                </Button>
              </Link>
              <Link href={`/report/${runId}`}>
                <Button variant="outline">
                  <FileText className="h-4 w-4" /> Report
                </Button>
              </Link>
              <Link href="/arena">
                <Button variant="outline">
                  <Swords className="h-4 w-4" /> Arena
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Progress + phase rail */}
        <div className="mb-6 space-y-3 rounded-2xl glass p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">{s.message}</span>
            <span className="font-mono text-muted-foreground">{Math.round(s.progress)}%</span>
          </div>
          <Progress value={s.progress} />
          <PhaseRail phase={s.phase} />
        </div>

        {s.status === "error" && (
          <div className="mb-6 rounded-2xl border border-ghost-rose/30 bg-ghost-rose/10 p-4 text-sm text-ghost-rose">
            {s.error ?? "Something went wrong."} — <Link href="/dashboard" className="underline">try again</Link>.
          </div>
        )}

        {/* Metrics */}
        <div className="mb-6">
          <MetricTicker
            simulated={s.metrics.simulated}
            avgPurchase={s.metrics.avgPurchase}
            avgConfusion={s.metrics.avgConfusion}
            conversionRisk={s.metrics.conversionRisk}
          />
        </div>

        {/* Main grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <SwarmGrid personas={s.personas} sims={s.simsById} total={s.total || s.personas.length} />
            <div className="grid gap-6 sm:grid-cols-2">
              <SimFeed sims={s.sims} />
              <Discoveries leaks={s.leaks} objections={s.objections} />
            </div>
          </div>
          <div className="lg:col-span-1">
            <AgentStream thoughts={s.thoughts} />
          </div>
        </div>

        {/* Live focus group — real persona reactions streamed in as chat */}
        <div className="mt-6">
          <ReactionBoard personas={s.personas} sims={s.sims} />
        </div>

        {done && s.insights && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl glass p-6 sm:flex-row"
          >
            <div>
              <p className="text-lg font-semibold">{s.insights.headline}</p>
              <p className="text-sm text-muted-foreground">
                Estimated <span className="text-ghost-emerald">+{s.insights.estConversionUplift}%</span> conversion uplift if the top fixes ship.
              </p>
            </div>
            <Link href={`/insights/${runId}`}>
              <Button variant="accent" size="lg">
                Explore full insights <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </>
  );
}
