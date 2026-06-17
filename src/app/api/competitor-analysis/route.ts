import { NextRequest } from "next/server";
import { aiAnalyze } from "@/lib/ai/gemini";
import { crawlSite } from "@/lib/crawl/crawler";
import { mockCompetitor } from "@/lib/data/mock-engine";
import { normalizeUrl } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// POST { url, competitorUrl } -> CompetitorAnalysis
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const url = normalizeUrl(String(body?.url ?? ""));
  const competitorUrl = normalizeUrl(String(body?.competitorUrl ?? ""));
  if (!url || !competitorUrl) {
    return Response.json({ error: "Both url and competitorUrl are required" }, { status: 400 });
  }

  const crawl = await crawlSite(url);
  const youAnalysis = await aiAnalyze({ url, personaCount: 0 }, crawl.text, crawl.source);
  const result = mockCompetitor(url, competitorUrl, youAnalysis);
  return Response.json(result);
}
