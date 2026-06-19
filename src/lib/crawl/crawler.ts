// ---------------------------------------------------------------------------
// Website content acquisition with three tiers of graceful degradation:
//   1. Firecrawl (FIRECRAWL_API_KEY) — clean markdown extraction
//   2. Plain server-side fetch + HTML→text strip
//   3. null → the analyzer uses the deterministic mock engine
// ---------------------------------------------------------------------------

const FIRECRAWL_KEY = process.env.FIRECRAWL_API_KEY;

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T | null> {
  try {
    return await Promise.race([
      p,
      new Promise<T>((_, rej) => setTimeout(() => rej(new Error("timeout")), ms)),
    ]);
  } catch {
    return null;
  }
}

export interface CrawlResult {
  text: string | null;
  source: "firecrawl" | "fetch" | "none";
}

export async function crawlSite(url: string): Promise<CrawlResult> {
  // Tier 1: Firecrawl
  if (FIRECRAWL_KEY) {
    const fc = await withTimeout(firecrawl(url), 25000);
    if (fc) return { text: fc, source: "firecrawl" };
  }
  // Tier 2: plain fetch
  const html = await withTimeout(plainFetch(url), 12000);
  if (html) return { text: html, source: "fetch" };
  // Tier 3: nothing — mock engine takes over
  return { text: null, source: "none" };
}

/** Capture a full-page screenshot via Firecrawl. Returns a hosted image URL,
 *  or null if no key / capture failed (caller surfaces an honest error). */
export async function screenshotSite(url: string): Promise<string | null> {
  if (!FIRECRAWL_KEY) return null;
  try {
    const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${FIRECRAWL_KEY}` },
      body: JSON.stringify({ url, formats: ["screenshot@fullPage"] }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.screenshot ?? data?.screenshot ?? null;
  } catch {
    return null;
  }
}

async function firecrawl(url: string): Promise<string | null> {
  const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${FIRECRAWL_KEY}`,
    },
    body: JSON.stringify({ url, formats: ["markdown"], onlyMainContent: true }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.data?.markdown ?? data?.markdown ?? null;
}

async function plainFetch(url: string): Promise<string | null> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; GhostCustomerAI/1.0; +https://ghostcustomer.ai/bot)",
      Accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
  });
  if (!res.ok) return null;
  const html = await res.text();
  return htmlToText(html);
}

/** Minimal, dependency-free HTML → readable text. */
export function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<\/(p|div|section|li|h[1-6]|tr|article|header|footer)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 20000);
}
