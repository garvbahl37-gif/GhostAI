import { engineName, isGeminiEnabled } from "@/lib/ai/gemini";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    ok: true,
    engine: engineName(),
    gemini: isGeminiEnabled(),
    firecrawl: Boolean(process.env.FIRECRAWL_API_KEY),
    pythonEngine: Boolean(process.env.PYTHON_ENGINE_URL),
    time: new Date().toISOString(),
  });
}
