import type { RunState } from "./types";

// ---------------------------------------------------------------------------
// In-memory run store.
//
// Survives across API requests within a single server process — enough for the
// live demo and for the dashboard / insights / report pages to read a run's
// results after the simulation stream completes. Swap this for Supabase by
// implementing the same get/set/list interface against the `projects` /
// `simulations` / `insights` tables (see supabase/schema.sql).
// ---------------------------------------------------------------------------

declare global {
  // eslint-disable-next-line no-var
  var __ghostRunStore: Map<string, RunState> | undefined;
}

const store: Map<string, RunState> =
  globalThis.__ghostRunStore ?? (globalThis.__ghostRunStore = new Map());

const MAX_RUNS = 50; // keep memory bounded on long-lived dev servers

export function saveRun(run: RunState): void {
  store.set(run.runId, run);
  if (store.size > MAX_RUNS) {
    const oldest = [...store.values()].sort((a, b) => a.createdAt - b.createdAt)[0];
    if (oldest) store.delete(oldest.runId);
  }
}

export function getRun(runId: string): RunState | undefined {
  return store.get(runId);
}

export function listRuns(): RunState[] {
  return [...store.values()].sort((a, b) => b.createdAt - a.createdAt);
}

export function deleteRun(runId: string): void {
  store.delete(runId);
}
