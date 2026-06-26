"use client";

import { motion } from "framer-motion";
import type { HeatmapZone } from "@/lib/types";

function heatColor(c: number): string {
  // 0 (calm emerald) -> 100 (hot rose)
  if (c >= 70) return "#0f172a";
  if (c >= 50) return "#334155";
  if (c >= 35) return "#64748b";
  return "#94a3b8";
}

export function Heatmap({ zones }: { zones: HeatmapZone[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {zones.map((z, i) => {
        const color = heatColor(z.confusion);
        return (
          <motion.div
            key={z.zone}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="relative overflow-hidden rounded-xl border border-slate-200 p-4"
            style={{ background: `${color}14` }}
          >
            <div className="absolute inset-x-0 top-0 h-1" style={{ background: color }} />
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{z.zone}</p>
              <span className="font-mono text-sm font-bold" style={{ color }}>
                {z.confusion}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{z.note}</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full" style={{ width: `${z.confusion}%`, background: color }} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
