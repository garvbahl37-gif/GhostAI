"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, ScanLine, Loader2, Crosshair } from "lucide-react";
import type { VisionRoast } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SAMPLES = ["stripe.com", "notion.so", "linear.app", "vercel.com"];
const SEV: Record<string, { c: string; label: string }> = {
  high: { c: "#fb7185", label: "High friction" },
  medium: { c: "#fbbf24", label: "Medium" },
  low: { c: "#d6d6da", label: "Minor" },
};

export function VisualRoast() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<VisionRoast | null>(null);

  async function roast(target: string) {
    if (!target.trim()) return;
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/vision-roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Roast failed");
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
        <Badge variant="cyan" className="mb-3">
          <Eye className="h-3 w-3" /> AI Vision Roast
        </Badge>
        <h1 className="text-3xl font-bold sm:text-4xl">
          Let an AI customer <span className="gradient-text">look at your page.</span>
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
          We screenshot your site and a Gemini-vision &quot;ghost&quot; tells you where its eye goes, what confuses it, and
          where it gets stuck — drawn right on the page.
        </p>
      </div>

      <Card className="mb-8 p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            roast(url);
          }}
          className="space-y-3"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="yourcompany.com" className="flex-1" autoFocus />
            <Button type="submit" size="lg" disabled={loading || !url.trim()}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanLine className="h-4 w-4" />}
              {loading ? "Looking…" : "Roast my UI"}
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Try:</span>
            {SAMPLES.map((s) => (
              <button key={s} type="button" onClick={() => { setUrl(s); roast(s); }} className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-foreground/80 transition hover:bg-white/10">
                {s}
              </button>
            ))}
          </div>
          {error && <p className="text-sm text-ghost-rose">{error}</p>}
        </form>
      </Card>

      {loading && (
        <div className="rounded-2xl glass p-10 text-center text-sm text-muted-foreground">
          Capturing a full-page screenshot and asking a Gemini-vision customer to react… (5–20s)
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Card>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">First impression</p>
                <p className="mt-1 text-lg font-medium text-foreground/90">“{result.roast}”</p>
              </div>
              <div className="text-center">
                <p className="font-mono text-4xl font-bold" style={{ color: result.clarityScore >= 66 ? "#f2f2f4" : result.clarityScore >= 40 ? "#a6a6ae" : "#6f6f77" }}>
                  {result.clarityScore}
                </p>
                <p className="text-xs text-muted-foreground">clarity / 100</p>
              </div>
            </CardContent>
          </Card>

          {/* annotated screenshot */}
          <Card>
            <CardContent className="p-3">
              <div className="relative w-full overflow-hidden rounded-xl ring-1 ring-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={result.screenshotUrl} alt="Screenshot of the analyzed page" className="block w-full" />

                {/* confusion regions */}
                {result.regions.map((r, i) => {
                  const [ymin, xmin, ymax, xmax] = r.box;
                  const sev = SEV[r.severity] ?? SEV.low;
                  return (
                    <div
                      key={i}
                      className="absolute rounded-md"
                      style={{
                        top: `${ymin / 10}%`,
                        left: `${xmin / 10}%`,
                        width: `${Math.max(0, (xmax - xmin) / 10)}%`,
                        height: `${Math.max(0, (ymax - ymin) / 10)}%`,
                        border: `2px solid ${sev.c}`,
                        background: `${sev.c}18`,
                        boxShadow: `0 0 18px -4px ${sev.c}`,
                      }}
                      title={`${r.label}: ${r.why}`}
                    >
                      <span
                        className="absolute -top-2 -left-2 grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold text-black"
                        style={{ background: sev.c }}
                      >
                        {i + 1}
                      </span>
                    </div>
                  );
                })}

                {/* eye-lands-here marker */}
                {result.firstLook && (
                  <div
                    className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ top: `${result.firstLook.y / 10}%`, left: `${result.firstLook.x / 10}%` }}
                  >
                    <span className="absolute inline-flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-white/40" />
                    <Crosshair className="relative h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow" />
                  </div>
                )}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 px-1">
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Crosshair className="h-3 w-3" /> eye lands here
                </span>
                {Object.values(SEV).map((s) => (
                  <span key={s.label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="h-2 w-2 rounded-sm" style={{ background: s.c }} /> {s.label}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* region list */}
          <div className="grid gap-3 sm:grid-cols-2">
            {result.regions.map((r, i) => {
              const sev = SEV[r.severity] ?? SEV.low;
              return (
                <div key={i} className="flex items-start gap-3 rounded-2xl glass p-4">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold text-black" style={{ background: sev.c }}>
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{r.label}</p>
                    <p className="text-xs text-muted-foreground">{r.why}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
