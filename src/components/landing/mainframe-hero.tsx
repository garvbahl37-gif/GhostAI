"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// Mainframe-style scrub-video hero, adapted to Next.js and filled with
// GhostCustomer's own content (brand, nav, messaging) per the brief.
const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4";

const SENSITIVITY = 0.8;
const EMAIL = "hello@ghostcustomer.ai";

const NAV = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "UI Roast", href: "/roast" },
  { label: "Battle Arena", href: "/arena" },
  { label: "Pricing Lab", href: "/pricing-lab" },
];

const PILLS = [
  { label: "Run a simulation", href: "/dashboard" },
  { label: "Roast my UI", href: "/roast" },
  { label: "Battle a competitor", href: "/arena" },
  { label: "See pricing impact", href: "/pricing-lab" },
];

const TYPEWRITER_TEXT =
  "Glad you stopped in. We meet your customers before reality does. So — what are we putting to the test?";

/** Reveals `text` one character at a time, but only after `enabled` becomes true. */
function useTypewriter(text: string, speed = 38, startDelay = 600, enabled = true) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!enabled) return; // wait until loader signals done
    setDisplayed("");
    setDone(false);
    let i = 0;
    let interval: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [text, speed, startDelay, enabled]);

  return { displayed, done };
}

export function MainframeHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevX = useRef<number | null>(null);
  const targetTime = useRef(0);

  const [menuOpen, setMenuOpen] = useState(false);
  const [pillsVisible, setPillsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // True once the video has its first frame decoded — used to fade away the
  // grey fallback cover so there's no black flash while the video loads.
  const [videoReady, setVideoReady] = useState(false);
  const [loaderDone, setLoaderDone] = useState(() => {
    if (typeof window !== "undefined") {
      return !!sessionStorage.getItem("ghostai_loading_complete");
    }
    return false;
  });

  // Listen for the loader's completion event; fall back to auto-start after
  // 10 s so the hero still works on pages that don't mount a loading screen.
  useEffect(() => {
    if (loaderDone) return; // Already done from sessionStorage

    const handler = () => setLoaderDone(true);
    window.addEventListener("ghostloader:complete", handler, { once: true });
    const fallback = setTimeout(() => setLoaderDone(true), 10_000);
    return () => {
      window.removeEventListener("ghostloader:complete", handler);
      clearTimeout(fallback);
    };
  }, [loaderDone]);

  const { displayed, done } = useTypewriter(TYPEWRITER_TEXT, 38, 400, loaderDone);

  // Mouse-scrub the video — buttery smooth. The mouse only updates a *target*
  // time; a requestAnimationFrame loop eases the playhead toward it and issues
  // at most ONE seek per decoded frame (guarded by `video.seeking`), so it never
  // floods the decoder. Easing keeps each step tiny → near-instant decode.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let raf = 0;
    let display = 0; // eased playhead

    // Warm the decode pipeline so the first scrub isn't janky (muted play→pause).
    const warm = () => {
      video.play().then(() => video.pause()).catch(() => {});
      video.removeEventListener("loadeddata", warm);
    };
    video.addEventListener("loadeddata", warm);

    function onMove(e: MouseEvent) {
      const v = videoRef.current;
      if (!v || !v.duration) return;
      if (prevX.current === null) {
        prevX.current = e.clientX;
        return;
      }
      const delta = e.clientX - prevX.current;
      prevX.current = e.clientX;
      const next = targetTime.current + (delta / window.innerWidth) * SENSITIVITY * v.duration;
      targetTime.current = Math.max(0, Math.min(v.duration, next));
    }

    function tick() {
      const v = videoRef.current;
      if (v && v.duration) {
        display += (targetTime.current - display) * 0.22;
        if (!v.seeking && Math.abs(display - v.currentTime) > 0.008) {
          v.currentTime = Math.max(0, Math.min(v.duration, display));
        }
      }
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      video.removeEventListener("loadeddata", warm);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Pills fade in 400ms after load, independent of the typewriter.
  useEffect(() => {
    const t = setTimeout(() => setPillsVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  // Navbar gets an opaque blurred bg once scrolled, so content scrolling under
  // it never shows through / overlaps the transparent bar.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Preload the whole clip into memory and swap the <video> to a blob URL, so
  // every scrub seek is LOCAL (no network stall) — this is what makes it smooth.
  useEffect(() => {
    let url: string | null = null;
    let cancelled = false;
    fetch(VIDEO_SRC)
      .then((r) => r.blob())
      .then((b) => {
        if (cancelled) return;
        url = URL.createObjectURL(b);
        const v = videoRef.current;
        if (!v) return;
        const t = v.currentTime || 0;
        v.src = url;
        v.load();
        v.addEventListener(
          "loadeddata",
          () => {
            try {
              v.currentTime = t;
            } catch {
              /* noop */
            }
          },
          { once: true },
        );
      })
      .catch(() => {
        /* fall back to streaming src already set in JSX */
      });
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <div style={{ fontFamily: "var(--font-body)" }} className="text-black">
      {/* ── Background video (mouse-scrub) ── */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        muted
        playsInline
        preload="auto"
        className="fixed inset-0 z-0 h-full w-full object-cover"
        style={{ objectPosition: "70% center" }}
        onLoadedData={() => setVideoReady(true)}
      />

      {/* ── Grey fallback cover — sits above the video (z-1) and fades away
           once the first frame is ready, preventing the black-video flash ── */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          backgroundColor: "#fbfbfd",
          opacity: videoReady ? 0 : 1,
          transition: "opacity 0.6s ease",
        }}
        aria-hidden="true"
      />

      {/* ── Navbar ── */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? "border-b border-slate-200/70 bg-white/80 backdrop-blur-xl" : "border-b border-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 sm:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <span
              className="text-[19px] font-medium tracking-tight text-black sm:text-[22px]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              GhostCustomer
              <span className="align-super text-[0.5em] font-normal">®</span>
            </span>
            <span className="select-none text-[20px] leading-none text-black sm:text-[24px]" style={{ letterSpacing: "-0.02em" }}>
              ✳︎
            </span>
          </Link>

          {/* Desktop nav links (truly centered) */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 text-[15px] font-medium text-black md:flex lg:gap-9">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="transition-opacity hover:opacity-50">
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <Link
            href="/dashboard"
            className="hidden text-[15px] font-medium text-black underline underline-offset-4 transition-opacity hover:opacity-50 md:block"
          >
            Launch
          </Link>

          {/* Mobile hamburger */}
          <button aria-label="Menu" onClick={() => setMenuOpen((v) => !v)} className="flex flex-col gap-[5px] md:hidden">
            <span
              className="h-[2px] w-6 bg-black transition-all duration-300"
              style={menuOpen ? { transform: "translateY(7px) rotate(45deg)" } : undefined}
            />
            <span className="h-[2px] w-6 bg-black transition-all duration-300" style={menuOpen ? { opacity: 0 } : undefined} />
            <span
              className="h-[2px] w-6 bg-black transition-all duration-300"
              style={menuOpen ? { transform: "translateY(-7px) rotate(-45deg)" } : undefined}
            />
          </button>
        </div>
      </header>

      {/* ── Mobile overlay ── */}
      <div
        className="fixed inset-0 z-[9] flex flex-col justify-center gap-8 bg-white/95 px-8 backdrop-blur-sm transition-opacity duration-300 md:hidden"
        style={{ opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none" }}
      >
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMenuOpen(false)}
            className="text-[32px] font-medium text-black"
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/dashboard"
          onClick={() => setMenuOpen(false)}
          className="text-[32px] font-medium text-black underline underline-offset-2"
        >
          Launch
        </Link>
      </div>

      {/* ── Hero ── */}
      <section className="relative z-[1] flex h-screen flex-col justify-end overflow-hidden px-5 pb-12 sm:px-8 md:justify-center md:px-10 md:pb-0">
        <div className="relative z-10 max-w-xl">
          {/* Blurred intro label */}
          <div
            className="pointer-events-none mb-5 select-none sm:mb-6"
            style={{
              fontSize: "clamp(18px, 4vw, 26px)",
              lineHeight: 1.3,
              fontWeight: 400,
              color: "#000",
              filter: "blur(4px)",
            }}
          >
            Hey there, meet your ghost customers,
            <br />
            GhostCustomer&apos;s hyper-realistic AI persona swarm
          </div>

          {/* Typewriter (reserve ~3 lines so the pills never jump while typing) */}
          <p
            className="mb-6 text-black sm:mb-7"
            style={{ fontSize: "clamp(18px, 4vw, 26px)", lineHeight: 1.35, fontWeight: 400, minHeight: "4.1em" }}
          >
            {displayed}
            {!done && (
              <span
                className="ml-[2px] inline-block h-[1.1em] w-[2px] bg-black align-middle"
                style={{ animation: "blink 1s step-end infinite" }}
              />
            )}
          </p>

          {/* Action pills */}
          <div
            className="flex flex-wrap gap-y-1"
            style={{
              opacity: pillsVisible ? 1 : 0,
              transform: pillsVisible ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
          >
            {PILLS.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center whitespace-nowrap rounded-full border border-black/10 bg-white px-4 py-[0.3em] text-[13px] text-black transition-colors duration-200 hover:bg-black hover:text-white sm:px-5 sm:text-[15px]"
              >
                {p.label}
              </Link>
            ))}

            <button
              onClick={copyEmail}
              className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white bg-transparent px-4 py-[0.3em] text-[13px] text-white transition-colors duration-200 hover:bg-white hover:text-black sm:gap-3 sm:px-5 sm:text-[15px]"
            >
              <span>
                Reach us: <span className="underline underline-offset-1">{EMAIL}</span>
              </span>
              {copied ? (
                <span className="text-[11px]">copied</span>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
