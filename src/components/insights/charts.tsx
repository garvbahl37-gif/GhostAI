"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  RadialBarChart,
  RadialBar,
  PolarRadiusAxis,
} from "recharts";
import type { HeatmapZone, Insights, Verdict } from "@/lib/types";
import { verdictColor } from "@/lib/utils";

const TOOLTIP = {
  contentStyle: {
    background: "rgba(255,255,255,0.97)",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 12,
    fontSize: 12,
    color: "#0f172a",
  },
  itemStyle: { color: "#0f172a" },
  labelStyle: { color: "#64748b" },
};

export function VerdictDonut({ data }: { data: Record<Verdict, number> }) {
  const entries = (Object.entries(data) as [Verdict, number][]).filter(([, v]) => v > 0);
  const total = entries.reduce((a, [, v]) => a + v, 0) || 1;
  const chart = entries.map(([name, value]) => ({ name, value }));
  return (
    <div className="relative h-56">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chart} dataKey="value" nameKey="name" innerRadius={62} outerRadius={88} paddingAngle={3} stroke="none">
            {chart.map((d) => (
              <Cell key={d.name} fill={verdictColor(d.name)} />
            ))}
          </Pie>
          <Tooltip {...TOOLTIP} formatter={(v: any) => [`${v} (${Math.round((Number(v) / total) * 100)}%)`, ""]} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-3xl font-bold">{total}</span>
        <span className="text-xs text-muted-foreground">customers</span>
      </div>
    </div>
  );
}

export function RoleBar({ data }: { data: Insights["roleBreakdown"] }) {
  const chart = [...data].sort((a, b) => a.purchaseProbability - b.purchaseProbability);
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chart} layout="vertical" margin={{ left: 8, right: 16 }}>
          <XAxis type="number" domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="role"
            width={120}
            tick={{ fill: "#475569", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip {...TOOLTIP} cursor={{ fill: "rgba(0,0,0,0.04)" }} formatter={(v: any) => [`${v}%`, "Purchase intent"]} />
          <Bar dataKey="purchaseProbability" radius={[0, 6, 6, 0]} barSize={16}>
            {chart.map((d) => (
              <Cell
                key={d.role}
                fill={d.purchaseProbability > 60 ? "#0f172a" : d.purchaseProbability > 45 ? "#64748b" : "#94a3b8"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ConfusionRadar({ zones }: { zones: HeatmapZone[] }) {
  const chart = zones.map((z) => ({ zone: z.zone.replace(/ \/.*/, ""), confusion: z.confusion }));
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chart} outerRadius="72%">
          <PolarGrid stroke="rgba(0,0,0,0.1)" />
          <PolarAngleAxis dataKey="zone" tick={{ fill: "#475569", fontSize: 10 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar dataKey="confusion" stroke="#475569" fill="#64748b" fillOpacity={0.25} />
          <Tooltip {...TOOLTIP} formatter={(v: any) => [`${v}/100`, "Confusion"]} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RiskGauge({ value }: { value: number }) {
  const color = value > 66 ? "#0f172a" : value > 40 ? "#64748b" : "#94a3b8";
  const data = [{ name: "risk", value, fill: color }];
  return (
    <div className="relative h-56">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart innerRadius="72%" outerRadius="100%" data={data} startAngle={220} endAngle={-40}>
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar background={{ fill: "rgba(0,0,0,0.06)" }} dataKey="value" cornerRadius={20} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-4xl font-bold" style={{ color }}>
          {value}
        </span>
        <span className="text-xs text-muted-foreground">conversion risk</span>
      </div>
    </div>
  );
}
