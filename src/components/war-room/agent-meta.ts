import {
  Globe,
  Users,
  Activity,
  DollarSign,
  LifeBuoy,
  TrendingDown,
  Sparkles,
  FileText,
  type LucideIcon,
} from "lucide-react";
import type { AgentName, RunPhase } from "@/lib/types";

export interface AgentMeta {
  name: AgentName;
  short: string;
  icon: LucideIcon;
  color: string;
  phases: RunPhase[]; // phases during which this agent is "active"
}

// Monochrome graphite scale with two restrained signal accents
// (Revenue Leak = red, Insight = blue) — matches the "OpenAI reasoning trace" feel.
export const AGENTS: AgentMeta[] = [
  { name: "Website Analyzer", short: "Analyzer", icon: Globe, color: "#e5e5e7", phases: ["analyzing"] },
  { name: "Persona Generator", short: "Personas", icon: Users, color: "#d4d4d8", phases: ["generating_personas"] },
  { name: "Customer Simulator", short: "Swarm", icon: Activity, color: "#c8c8cc", phases: ["simulating"] },
  { name: "Sales Agent", short: "Sales", icon: DollarSign, color: "#bcbcc4", phases: ["sales_support"] },
  { name: "Support Agent", short: "Support", icon: LifeBuoy, color: "#b0b0b8", phases: ["sales_support"] },
  { name: "Revenue Leak Agent", short: "Revenue", icon: TrendingDown, color: "#fb7185", phases: ["revenue_churn"] },
  { name: "Insight Agent", short: "Insights", icon: Sparkles, color: "#7dd3fc", phases: ["synthesizing"] },
  { name: "Report Generator", short: "Report", icon: FileText, color: "#d4d4d8", phases: ["reporting"] },
];

export const AGENT_BY_NAME: Record<AgentName, AgentMeta> = Object.fromEntries(
  AGENTS.map((a) => [a.name, a]),
) as Record<AgentName, AgentMeta>;

const PHASE_ORDER: RunPhase[] = [
  "queued",
  "analyzing",
  "generating_personas",
  "simulating",
  "sales_support",
  "revenue_churn",
  "synthesizing",
  "reporting",
  "done",
];

export function phaseIndex(p: RunPhase): number {
  const i = PHASE_ORDER.indexOf(p);
  return i < 0 ? 0 : i;
}

export type AgentStatus = "idle" | "active" | "done";

export function agentStatus(agent: AgentMeta, current: RunPhase): AgentStatus {
  const cur = phaseIndex(current);
  const agentPhase = phaseIndex(agent.phases[agent.phases.length - 1]);
  if (current === "done") return "done";
  if (agent.phases.includes(current)) return "active";
  return cur > agentPhase ? "done" : "idle";
}
