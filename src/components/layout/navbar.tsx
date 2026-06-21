"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ghost, LayoutDashboard, Swords, LineChart, Eye, Menu, X } from "lucide-react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  // Close mobile menu on path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
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
            "mx-auto flex items-center justify-between gap-3 rounded-2xl border transition-all duration-300 ease-in-out",
            scrolled
              ? "max-w-4xl px-4 py-2 border-white/12 bg-[#070714]/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_12px_40px_-12px_rgba(0,0,0,0.85)] backdrop-blur-2xl"
              : "max-w-5xl px-5 py-3.5 border-white/[0.07] bg-white/[0.03] backdrop-blur-xl",
          )}
        >
          {/* Brand */}
          <Link href="/" className="group flex items-center gap-2.5 pl-1">
            <span className="relative grid h-9 w-9 place-items-center rounded-xl border border-white/12 bg-white/[0.06] transition-transform duration-300 group-hover:scale-105">
              <Ghost className="h-5 w-5 text-foreground transition-transform duration-300 group-hover:rotate-6" />
              <span
                className="absolute -inset-1.5 rounded-2xl opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(99,102,241,0.1) 50%, transparent 70%)" }}
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
                      className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-violet-600/15 to-indigo-600/10 ring-1 ring-violet-500/30 border border-violet-500/10"
                      style={{ boxShadow: "0 0 16px -2px rgba(139,92,246,0.45)" }}
                      transition={{ type: "spring", stiffness: 360, damping: 30 }}
                    />
                  )}
                  <Icon className="h-3.5 w-3.5 align-middle" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions & Mobile Toggle */}
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="relative overflow-hidden rounded-xl bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0a0a0b] shadow-[0_4px_12px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] sm:px-4 sm:py-2 sm:text-sm group"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-violet-500/25 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />
              <span className="relative z-10">Launch</span>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08] hover:text-foreground md:hidden transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mt-2.5 overflow-hidden rounded-2xl border border-white/10 bg-[#070714]/90 p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl md:hidden"
            >
              <div className="flex flex-col gap-1">
                {NAV.map((item) => {
                  const active = pathname?.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                        active
                          ? "bg-gradient-to-r from-violet-600/15 to-indigo-600/10 text-white ring-1 ring-violet-500/30"
                          : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
                      )}
                    >
                      <Icon className={cn("h-4 w-4", active ? "text-violet-400" : "text-muted-foreground")} />
                      <span className="flex-1">{item.label}</span>
                      {active && <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

