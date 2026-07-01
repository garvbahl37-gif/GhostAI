import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Cross-origin policy for /api/*.
// Same-origin requests (the app calling its own API) send no Origin header and
// need no CORS headers. Cross-origin requests are allowed ONLY for origins
// explicitly listed in ALLOWED_ORIGINS (comma-separated) — never "*".
const ALLOWED = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function applyCors(res: NextResponse, origin: string | null): NextResponse {
  if (origin && ALLOWED.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Vary", "Origin");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.headers.set("Access-Control-Max-Age", "86400");
  }
  return res;
}

// Clerk session handling for every route + the existing /api CORS policy.
// Routes are gated on the client (SignedIn / SignedOut / <AuthGate>), so the
// middleware only needs to attach Clerk's auth context — no auth.protect() here.
export default clerkMiddleware((_auth, req: NextRequest) => {
  const isApi = req.nextUrl.pathname.startsWith("/api");
  const origin = req.headers.get("origin");

  if (isApi && req.method === "OPTIONS") {
    return applyCors(new NextResponse(null, { status: 204 }), origin);
  }

  const res = NextResponse.next();
  return isApi ? applyCors(res, origin) : res;
});

export const config = {
  matcher: [
    // Run on everything except Next internals and static assets…
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // …and always on API routes.
    "/(api|trpc)(.*)",
  ],
};
