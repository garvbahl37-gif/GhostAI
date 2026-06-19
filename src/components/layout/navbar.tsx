"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Ghost, LayoutDashboard, Swords, LineChart, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/roast", label: "UI Roast", icon: Eye },
  { href: "/arena", label: "Battle Arena", icon: Swords },
  { href: "/pricing-lab", label: "Pricing Lab", icon: LineChart },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hideForLandingLoading, setHideForLandingLoading] = useState(pathname === "/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      setHideForLandingLoading(false);
      return;
    }

    setHideForLandingLoading(true);
    const onLoadingComplete = () => setHideForLandingLoading(false);
    window.addEventListener("landing-loading-complete", onLoadingComplete);
    return () => window.removeEventListener("landing-loading-complete", onLoadingComplete);
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn("fixed inset-x-0 top-0 z-50", hideForLandingLoading && "invisible pointer-events-none")}
    >
      <div className="container px-4 pt-3 sm:pt-4">
        <div
          className={cn(
            "mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-2xl border px-3 py-2 transition-all duration-300",
            scrolled
              ? "border-white/10 bg-[#0a0a16]/80 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
              : "border-white/[0.07] bg-white/[0.03] backdrop-blur-xl",
          )}
        >
          {/* Brand */}
          <Link href="/" className="group flex items-center gap-2.5 pl-1">
            <span className="relative grid h-9 w-9 place-items-center rounded-xl border border-white/12 bg-white/[0.06]">
              <Ghost className="h-5 w-5 text-foreground" />
              <span
                className="absolute -inset-1.5 rounded-2xl opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: "radial-gradient(circle, rgba(255,255,255,0.35), transparent 70%)" }}
              />
            </span>
            <span className="text-[15px] font-bold tracking-tight">
              Ghost<span className="gradient-text">Customer</span>
            </span>
          </Link>

          {/* Center nav (segmented) */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-xl border border-white/[0.06] bg-white/[0.03] p-1 md:flex">
            {NAV.map((item) => {
              const active = pathname?.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
                    active ? "text-white" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-ghost-violet/30 to-ghost-indigo/20 ring-1 ring-ghost-violet/40"
                      style={{ boxShadow: "0 0 20px -4px rgba(139,92,246,0.5)" }}
                      transition={{ type: "spring", stiffness: 360, damping: 30 }}
                    />
                  )}
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/dashboard"
              className="shimmer rounded-xl bg-[#fafafa] px-4 py-2 text-sm font-semibold text-[#0a0a0b] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_10px_30px_-12px_rgba(0,0,0,0.9)] transition hover:-translate-y-0.5 hover:bg-white"
            >
              Launch
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
