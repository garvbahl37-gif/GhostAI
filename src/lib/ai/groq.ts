import { sleep } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Groq client (OpenAI-compatible) for fast, generous-quota TEXT generation:
// website analysis, executive report, auto-fix copy. Vision (UI Roast) stays on
// Gemini. Returns null on any failure so callers fall back (Gemini -> mock).
// ---------------------------------------------------------------------------

const KEY = process.env.GROQ_API_KEY;
const PRIMARY = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const MODELS = [...new Set([PRIMARY, "llama-3.1-8b-instant"])];
const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

export function groqEnabled(): boolean {
  return Boolean(KEY);
}

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return await Promise.race([
    p,
    new Promise<T>((_, rej) => setTimeout(() => rej(new Error("groq timeout")), ms)),
  ]);
}

function stripFences(s: string): string {
  const t = s.trim();
  if (t.startsWith("```")) return t.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
  return t;
}

/**
 * Call Groq expecting strict JSON (OpenAI-compatible json_object mode).
 * NOTE: json_object mode requires the word "JSON" in the prompt — all our
 * prompts already say "Return STRICT JSON". Returns null on total failure.
 */
export async function groqJSON<T>(prompt: string, timeoutMs = 22000): Promise<T | null> {
  if (!KEY) return null;
  for (const model of MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await withTimeout(
          fetch(ENDPOINT, {
            method: "POST",
            headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model,
              messages: [{ role: "user", content: prompt }],
              response_format: { type: "json_object" },
              temperature: 0.3,
            }),
          }),
          timeoutMs,
        );
        if (!res.ok) {
          const txt = (await res.text().catch(() => "")).slice(0, 140);
          throw new Error(`${res.status} ${txt}`);
        }
        const data = await res.json();
        const content: string = data?.choices?.[0]?.message?.content ?? "";
        return JSON.parse(stripFences(content)) as T;
      } catch (err) {
        const msg = ((err as Error).message || "").slice(0, 140);
        console.warn(`[groq] ${model} attempt ${attempt + 1} failed: ${msg}`);
        if (/429|quota|rate limit|too many|resource exhausted/i.test(msg)) break; // next model
        const transient = /5\d\d|timeout|unavailable|fetch failed|ECONN|ETIMEDOUT/i.test(msg);
        if (transient && attempt === 0) {
          await sleep(800);
          continue;
        }
        break;
      }
    }
  }
  return null;
}
