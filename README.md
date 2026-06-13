# Ghost Customer AI

### _The AI that becomes your customer before your customer becomes your problem._

![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-0055FF?logo=framer&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2.15-FF6384)
![Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?logo=googlegemini&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-0.2-1C3C3C)
![Supabase](https://img.shields.io/badge/Supabase-pgvector-3FCF8E?logo=supabase&logoColor=white)
![Zero-Key](https://img.shields.io/badge/Runs_with-ZERO_keys-22C55E)

---

## The Problem

Every SaaS landing page is a black box. You ship it, then wait weeks for real
traffic, heatmaps, and churn data to tell you what's broken — by which point you've
already burned the ad spend and lost the customers. Conversion blockers, unanswered
sales objections, support gaps, and silent revenue leaks only reveal themselves
**after** they've cost you money.

## The Solution

**Ghost Customer AI** spins up _hundreds_ of AI-generated virtual customers — "ghosts" —
that browse your website like real prospects would. Each ghost has a distinct persona
(a budget-conscious Student, a security-obsessed Enterprise Buyer, a time-poor Agency
Owner…), walks your funnel from **Landing → Pricing → Features → Onboarding → Support**,
and reports exactly where it got confused, where it hesitated, what objection killed
the deal, and whether it would convert, churn, or bounce.

You watch it happen **live** in a "war room", then get a board-ready executive report
quantifying conversion risk, churn risk, revenue leakage, and the projected uplift if
you fix each issue — all **before a single real customer hits the page.**

> ### This is NOT a chatbot.
> A chatbot _talks to_ your customer. Ghost Customer AI **becomes** your customer.
> It doesn't answer questions about your product — it experiences your product the way
> a skeptical buyer would, and tells you why they'd walk away.

---

## The 10 Major Features

| # | Feature | What it does |
|---|---------|--------------|
| 1 | **Ghost Customer Swarm** | Spins up 12–500 AI personas that each simulate a full buying journey across your site. |
| 2 | **Live War Room** (`/simulation/[runId]`) | Real-time NDJSON stream of agent "thoughts", persona cards, verdicts, and animated metrics as the swarm runs. |
| 3 | **Website Intelligence** | Crawls & analyzes your site — value props, CTAs, pricing tiers, FAQs, trust signals, and a 0–100 content clarity score. |
| 4 | **Conversion Risk Engine** | Per-persona purchase probability, confusion, trust, and a `Convert / Maybe / Churn Risk / Bounce` verdict. |
| 5 | **Sales Objection Mining** | Surfaces the exact questions buyers ask that your site never answers, scored by impact and affected roles. |
| 6 | **Support Gap Detection** | Flags scenarios where FAQ/doc coverage is too thin, raising support dependency and churn. |
| 7 | **Revenue Leak Quantification** | Names each leak, its cause, % of customers affected, estimated conversion loss, revenue impact, and the fix. |
| 8 | **Churn Risk Segmentation** | Identifies which customer segments will churn and why (Pricing / Onboarding / Missing Features / Poor Support / Complexity). |
| 9 | **Pricing Time Machine** (`/pricing-lab`) | Constant-elasticity demand model that finds your revenue-maximizing price and predicts segment reactions. |
| 10 | **Competitor Battle Arena** (`/arena`) | Head-to-head scoring of your site vs. a competitor across dimensions, with per-persona preferences. |

Plus an **Executive Report Generator** (`/report/[runId]`) that turns it all into a
crisp narrative with prioritized, effort-vs-impact recommendations.

---

## The 8-Agent Pipeline

The canonical multi-agent graph — implemented identically in TypeScript
(`src/lib/agents/orchestrator.ts`) and Python LangGraph (`agents-py/graph.py`):

```
  Website Analyzer ──▶ Persona Generator ──▶ Customer Simulation Swarm
                                                   ├──▶ Sales Agent ──┐
                                                   └──▶ Support Agent ┘
                                                        │
                                                Revenue Leak Agent ──▶ Insight Agent ──▶ Report Generator
```

| Agent | Role |
|-------|------|
| **Website Analyzer** | Crawls the site (Firecrawl → fetch → mock) and extracts structured intelligence. |
| **Persona Generator** | Spawns the ghost customers across 10 canonical roles. |
| **Customer Simulation Swarm** | Each ghost browses the funnel; gap-penalty scoring produces verdicts. |
| **Sales Agent** | Catalogues purchase-blocking objections (runs in parallel with Support). |
| **Support Agent** | Measures support dependency and FAQ/doc coverage gaps (parallel branch). |
| **Revenue Leak Agent** | Fan-in node that joins Sales + Support and quantifies revenue leakage. |
| **Insight Agent** | Aggregates everything into the `Insights` object (+ optional competitor analysis). |
| **Report Generator** | Writes the board-ready `ExecutiveReport` (Gemini narrative, mock fallback). |

> **Why this split?** Site understanding and report narrative go through Gemini (where
> language reasoning adds the most value). Per-persona scoring stays in a fast,
> grounded, deterministic engine — so a 500-ghost swarm never fans out into 500 fragile
> LLM calls. Every number on every screen traces back to the same detected gaps.

---

## Architecture Overview

Ghost Customer AI is a **full-stack TypeScript app** with an **optional** Python engine
and **optional** Supabase persistence — all three layers degrade gracefully.

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Next.js 15 (App Router) — Vercel                                          │
│  ┌──────────────┐   ┌──────────────────────────────────────────────────┐  │
│  │  React 19 UI │   │  API Routes (/api/*)                              │  │
│  │  Tailwind    │◀─▶│  POST /api/run  →  NDJSON stream of RunEvents     │  │
│  │  Framer      │   │  ┌────────────────────────────────────────────┐  │  │
│  │  Recharts    │   │  │  TS Multi-Agent Engine                      │  │  │
│  │  War Room    │   │  │  src/lib/agents/orchestrator.ts (8 agents)  │  │  │
│  └──────────────┘   │  │   ├─ crawl/crawler.ts  (Firecrawl→fetch→∅)  │  │  │
│                     │  │   ├─ ai/gemini.ts      (Gemini 2.5 Flash)   │  │  │
│                     │  │   └─ data/mock-engine.ts (deterministic)    │  │  │
│                     │  └────────────────────────────────────────────┘  │  │
│                     │             │ (optional /py/* rewrite)             │  │
│                     └─────────────┼────────────────────────────────────┘  │
└─────────────────────────────────────┼──────────────────────────────────────┘
                                       ▼ (only if PYTHON_ENGINE_URL set)
                  ┌────────────────────────────────────────┐
                  │  Python Engine — Render / Railway       │
                  │  FastAPI + LangGraph (agents-py/)        │
                  │  graph.py mirrors orchestrator.ts        │
                  └────────────────────────────────────────┘
                                       │ (optional)
                  ┌────────────────────────────────────────┐
                  │  Supabase: Postgres + pgvector + Auth   │
                  └────────────────────────────────────────┘
```

- **Primary path (default):** the Next.js TS engine runs the whole pipeline in-process
  and streams results. **No external services required.**
- **Optional Python path:** set `PYTHON_ENGINE_URL` to route through the real LangGraph
  `StateGraph` engine. The contract (camelCase JSON, NDJSON `RunEvent`s) is identical.
- **Optional persistence:** Supabase stores runs/insights/reports; without it, runs live
  in an in-process store + client-side `localStorage` cache.

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the full agent graph, data flow, and
streaming protocol.

---

## Quickstart — Zero Keys, Full Demo

**You do not need a single API key.** With no `.env`, the app runs on a deterministic,
seeded mock engine and the entire end-to-end demo works offline. The same URL always
produces the same result, so demos are reproducible.

```bash
npm install
npm run dev
# open http://localhost:3000
```

That's it. Go to **`/dashboard`**, paste any URL (e.g. `https://linear.app`), pick a
persona count, and hit run — you'll watch the ghost swarm light up the War Room and
land on a full executive report.

> **Note:** Edit `next.config.mjs`? No need. Everything optional is read from env vars,
> all of which are blank by default.

---

## Environment Variables (all optional)

Copy `.env.example` → `.env.local`. Leave everything blank to run on the mock engine.

| Variable | Purpose | Fallback if unset |
|----------|---------|-------------------|
| `GEMINI_API_KEY` | Enables real Gemini analysis of crawled content + report narrative. | Deterministic mock engine |
| `GEMINI_MODEL` | Gemini model id. | `gemini-2.5-flash` |
| `FIRECRAWL_API_KEY` | Enables Firecrawl clean-markdown crawling. | Plain `fetch` → HTML strip → mock |
| `PYTHON_ENGINE_URL` | Routes `/py/*` to the FastAPI + LangGraph engine (e.g. `http://localhost:8000`). | Built-in TS engine |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (persistence + auth). | In-memory + `localStorage` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key. | — |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side writes). | — |

---

## Page Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page — the pitch. |
| `/dashboard` | Create a run: enter URL, persona count, optional competitor + price. |
| `/simulation/[runId]` | **Live "war room"** — watch the swarm stream in real time. |
| `/insights/[runId]` | Aggregated insights: verdict breakdown, objections, leaks, churn, heatmap. |
| `/arena` | Competitor Battle Arena — you vs. a rival, scored. |
| `/pricing-lab` | Pricing Time Machine — find the revenue-maximizing price. |
| `/report/[runId]` | Board-ready executive report with prioritized recommendations. |

## API Routes (Next.js)

| Method | Route | Body / Query | Returns |
|--------|-------|--------------|---------|
| `POST` | `/api/project` | `{ url, … }` | Creates/initializes a project. |
| `POST` | `/api/run` | `{ url, personaCount, competitorUrl?, currentPrice?, fast? }` | **NDJSON stream** of `RunEvent`s. |
| `GET` | `/api/run?runId=` | — | Completed `RunState` (single-instance fallback). |
| `POST` | `/api/crawl` | `{ url }` | `{ url, source, text, analysis }` |
| `POST` | `/api/generate-personas` | `{ url, personaCount }` | `{ personas: Persona[] }` |
| `POST` | `/api/competitor-analysis` | `{ url, competitorUrl }` | `CompetitorAnalysis` |
| `POST` | `/api/pricing-simulation` | `{ currentPrice, proposedPrice }` | `PricingSimulation` |
| `GET` | `/api/insights?runId=` | — | `Insights` |
| `GET` | `/api/report?runId=` | — | `ExecutiveReport` |
| `GET` | `/api/health` | — | `{ ok, engine, gemini, firecrawl, pythonEngine, time }` |

The `/api/run` stream sets `Content-Type: application/x-ndjson`, `Cache-Control:
no-transform`, and `X-Accel-Buffering: no` so proxies don't buffer the live stream.

---

## Enabling the Optional Layers

### Enable Gemini (real AI analysis + report)
1. Grab a free key at <https://aistudio.google.com/apikey>.
2. Set `GEMINI_API_KEY=...` in `.env.local` (optionally `GEMINI_MODEL=gemini-2.5-flash`).
3. Restart `npm run dev`. `GET /api/health` now reports `"engine": "gemini"`.

If a Gemini call times out or returns malformed JSON, it transparently falls back to the
mock engine — the UI never breaks.

### Enable Firecrawl (better crawling)
1. Get a free key at <https://www.firecrawl.dev>.
2. Set `FIRECRAWL_API_KEY=...`. Crawls now return clean markdown; `analysis.source`
   becomes `"firecrawl"`. Without it, the app uses a dependency-free `fetch` + HTML strip,
   then falls to `"mock"`.

### Enable the Python LangGraph engine
1. `cd agents-py && pip install -r requirements.txt && uvicorn main:app --port 8000`
2. Set `PYTHON_ENGINE_URL=http://localhost:8000` in `.env.local`.
3. Restart `next dev`. `next.config.mjs` now proxies `/py/*` → the engine. The TS and
   Python engines speak the identical `RunEvent` NDJSON contract.

### Enable Supabase (persistence + auth)
1. Create a project at <https://supabase.com>, enable the `pgvector` extension.
2. Load the schema (see [`DEPLOYMENT.md`](./DEPLOYMENT.md)).
3. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
   `SUPABASE_SERVICE_ROLE_KEY`. The in-memory run store swaps for the
   `projects` / `simulations` / `insights` tables.

---

## Deploy Notes

- **Web (Vercel):** import the repo, framework auto-detected as Next.js. Add any optional
  env vars in **Project → Settings → Environment Variables**. With none, it still works.
- **Python engine (Render / Railway):** deploy `agents-py/` via its `Dockerfile`
  (`python:3.12-slim`, honors `$PORT`). Health check `/health`. Then set
  `PYTHON_ENGINE_URL=https://<service>.onrender.com` in Vercel.

Full step-by-step (Docker Compose, Supabase schema, per-var reference) lives in
[`DEPLOYMENT.md`](./DEPLOYMENT.md).

---

<sub>Built for the zero-key era: install, run, demo. No accounts, no secrets, no excuses.</sub>
