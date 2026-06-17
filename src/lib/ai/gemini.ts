import { GoogleGenerativeAI } from "@google/generative-ai";
import type { RunConfig, WebsiteAnalysis, ExecutiveReport, Insights, CompetitorAnalysis } from "@/lib/types";
import { mockAnalyze, buildReport } from "@/lib/data/mock-engine";
import { sleep } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Gemini client with graceful degradation.
//
// Everything here returns a valid result even when GEMINI_API_KEY is unset or
// the API errors — it falls back to the deterministic mock engine. AI is used
// where it adds the most value (understanding crawled site content and writing
// the executive narrative); per-persona scoring stays in the fast, grounded
// engine so a 200-customer swarm doesn't fan out into 200 fragile LLM calls.
// ---------------------------------------------------------------------------

// Primary model first, then resilient fallbacks. When the flagship model is
// overloaded (HTTP 503 "high demand"), we transparently retry on an alternate
// so real AI analysis survives transient spikes instead of dropping to mock.
const PRIMARY = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const MODELS = [...new Set([PRIMARY, "gemini-2.0-flash", "gemini-1.5-flash"])];
const KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

export function isGeminiEnabled(): boolean {
  return Boolean(KEY);
}

export function engineName(): "gemini" | "mock" {
  return isGeminiEnabled() ? "gemini" : "mock";
}

let client: GoogleGenerativeAI | null = null;
function getClient(): GoogleGenerativeAI | null {
  if (!KEY) return null;
  if (!client) client = new GoogleGenerativeAI(KEY);
  return client;
}

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return await Promise.race([
    p,
    new Promise<T>((_, rej) => setTimeout(() => rej(new Error("gemini timeout")), ms)),
  ]);
}

/**
 * Call Gemini expecting strict JSON. Retries transient overloads (503/429/
 * timeout) and falls back across alternate models before giving up. Returns
 * null only when every model/attempt fails (then the caller uses the mock).
 */
export async function generateJSON<T>(prompt: string, timeoutMs = 30000): Promise<T | null> {
  const c = getClient();
  if (!c) return null;

  for (const modelName of MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const model = c.getGenerativeModel({
          model: modelName,
          generationConfig: { responseMimeType: "application/json", temperature: 0.7 },
        });
        const res = await withTimeout(model.generateContent(prompt), timeoutMs);
        return JSON.parse(stripFences(res.response.text())) as T;
      } catch (err) {
        const msg = ((err as Error).message || "").slice(0, 140);
        const retryable = /503|429|overload|high demand|timeout|unavailable|fetch failed|ECONN|ETIMEDOUT/i.test(msg);
        console.warn(`[gemini] ${modelName} attempt ${attempt + 1} failed: ${msg}`);
        if (retryable && attempt === 0) {
          await sleep(900);
          continue; // retry same model once
        }
        break; // give up on this model, try the next
      }
    }
  }
  console.warn("[gemini] all models/attempts failed -> using mock engine");
  return null;
}

function stripFences(s: string): string {
  const t = s.trim();
  if (t.startsWith("```")) {
    return t.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
  }
  return t;
}

// ---------------------------------------------------------------------------
// AI-enhanced website analysis (from crawled content)
// ---------------------------------------------------------------------------
export async function aiAnalyze(
  config: RunConfig,
  crawledText: string | null,
  crawlSource: "firecrawl" | "fetch" | "none" = "none",
): Promise<WebsiteAnalysis> {
  const fallback = mockAnalyze(config); // fallback.source === "mock"
  if (!isGeminiEnabled() || !crawledText) return fallback;

  const prompt = `You are a B2B website analyst. Analyze the following website content and return STRICT JSON only.

URL: ${config.url}
CONTENT (may be truncated):
"""
${crawledText.slice(0, 12000)}
"""

Return JSON with this exact shape:
{
  "title": string,
  "tagline": string,
  "category": string,
  "valueProps": string[3],
  "ctas": string[],
  "navItems": string[],
  "pricingTiers": [{"name": string, "price": string, "period": string, "highlights": string[]}],
  "faqs": [{"q": string, "a": string}],
  "trustSignals": string[],
  "missingTrustSignals": string[],
  "onboardingSteps": string[],
  "detectedFeatures": string[],
  "targetAudience": string,
  "toneOfVoice": string,
  "contentScore": number  // 0-100, how clearly the site communicates value, pricing, trust
}
Be accurate to the content. If pricing or security info is absent, reflect that (empty arrays, low contentScore, list them in missingTrustSignals).`;

  const json = await generateJSON<Partial<WebsiteAnalysis>>(prompt);
  if (!json || !json.title) return fallback;

  // Merge AI output over a safe fallback so missing fields never break the UI.
  return {
    ...fallback,
    ...json,
    url: config.url,
    pricingTiers: json.pricingTiers?.length ? json.pricingTiers : fallback.pricingTiers,
    faqs: json.faqs ?? fallback.faqs,
    valueProps: json.valueProps?.length ? json.valueProps : fallback.valueProps,
    detectedFeatures: json.detectedFeatures?.length ? json.detectedFeatures : fallback.detectedFeatures,
    trustSignals: json.trustSignals ?? fallback.trustSignals,
    missingTrustSignals: json.missingTrustSignals ?? fallback.missingTrustSignals,
    contentScore: typeof json.contentScore === "number" ? json.contentScore : fallback.contentScore,
    // honest provenance: real AI analysis of a real crawl, or plain fetch
    source: crawlSource === "none" ? "fetch" : crawlSource,
  } as WebsiteAnalysis;
}

// ---------------------------------------------------------------------------
// AI-enhanced executive report narrative
// ---------------------------------------------------------------------------
export async function aiReport(
  analysis: WebsiteAnalysis,
  insights: Insights,
  competitor?: CompetitorAnalysis,
): Promise<ExecutiveReport> {
  const fallback = buildReport(analysis, insights, competitor);
  if (!isGeminiEnabled()) return fallback;

  const prompt = `You are a principal growth strategist writing an executive report for the business "${analysis.title}" (${analysis.category}).
Use ONLY the data below. Return STRICT JSON matching the schema. Be specific, quantitative, and board-ready.

DATA:
${JSON.stringify(
    {
      avgPurchaseProbability: insights.avgPurchaseProbability,
      avgConfusion: insights.avgConfusion,
      conversionRiskScore: insights.conversionRiskScore,
      verdictBreakdown: insights.verdictBreakdown,
      roleBreakdown: insights.roleBreakdown,
      revenueLeaks: insights.revenueLeaks,
      churnRisks: insights.churnRisks,
      unansweredQuestions: insights.salesObjections.filter((o) => !o.answeredOnSite).map((o) => o.question),
    },
    null,
    2,
  )}

Schema:
{
  "executiveSummary": string,  // 3-4 sentences
  "keyFindings": string[4],
  "conversionRisks": string[],
  "churnRisks": string[],
  "revenueLeaks": string[],
  "customerQuestions": string[],
  "competitorNotes": string[],
  "recommendations": [{"title": string, "detail": string, "effort": "Low"|"Medium"|"High", "impact": "Low"|"Medium"|"High"}],
  "projectedUplift": string
}`;

  const json = await generateJSON<ExecutiveReport>(prompt, 22000);
  if (!json || !json.executiveSummary) return fallback;
  return {
    ...fallback,
    ...json,
    recommendations: json.recommendations?.length ? json.recommendations : fallback.recommendations,
    customerQuestions: json.customerQuestions?.length ? json.customerQuestions : fallback.customerQuestions,
  };
}

// ---------------------------------------------------------------------------
// AI "live thought" for the war-room stream (optional flavor; falls back to "")
// ---------------------------------------------------------------------------
export async function aiThought(agent: string, context: string): Promise<string | null> {
  if (!isGeminiEnabled()) return null;
  const json = await generateJSON<{ thought: string }>(
    `You are the "${agent}" inside a customer-simulation engine. In ONE punchy sentence (max 18 words), narrate what you just observed. Context: ${context}. Return JSON {"thought": string}.`,
    8000,
  );
  return json?.thought ?? null;
}
