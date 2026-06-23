import { NextRequest } from "next/server";
import { screenshotSite } from "@/lib/crawl/crawler";
import { aiVisionRoast, isGeminiEnabled } from "@/lib/ai/gemini";
import { normalizeUrl } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

// POST { url } -> VisionRoast (real screenshot + Gemini Vision). No mock fallback.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const url = normalizeUrl(String(body?.url ?? ""));
  if (!url) return Response.json({ error: "A website URL is required" }, { status: 400 });

  if (!isGeminiEnabled()) {
    return Response.json(
      { error: "Visual Roast needs a Gemini API key (GEMINI_API_KEY) — it uses real vision, not mock data." },
      { status: 503 },
    );
  }

  const screenshotUrl = await screenshotSite(url);
  if (!screenshotUrl) {
    return Response.json(
      { error: "Couldn't capture a screenshot. A FIRECRAWL_API_KEY and a publicly reachable URL are required." },
      { status: 502 },
    );
  }

  const roast = await aiVisionRoast(screenshotUrl);
  if (!roast) {
    return Response.json({ error: "Vision analysis failed (model busy). Please try again." }, { status: 502 });
  }

  return Response.json({ screenshotUrl, source: "gemini-vision", ...roast });
}
