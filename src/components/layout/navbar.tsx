"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ghost, LayoutDashboard, Swords, LineChart, Eye, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/auth/user-menu";

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

  const isLanding = pathname === "/";

  // The homepage now uses the full-screen Mainframe hero, which ships its own
  // navbar — so the global navbar is hidden there to avoid a double header.
  if (pathname === "/") return null;

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
            isLanding
              ? scrolled
                ? "max-w-4xl px-4 py-2 border-slate-900/10 bg-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl"
                : "max-w-5xl px-5 py-3.5 border-transparent bg-transparent"
              : scrolled
                ? "max-w-4xl px-4 py-2 border-slate-200 bg-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_12px_40px_-12px_rgba(30,20,70,0.12)] backdrop-blur-2xl"
                : "max-w-5xl px-5 py-3.5 border-slate-200 bg-slate-50 backdrop-blur-xl",
          )}
        >
          {/* Brand */}
          <Link href="/" className="group flex items-center gap-2.5 pl-1">
            <span className={cn(
              "relative grid h-9 w-9 place-items-center rounded-xl border transition-transform duration-300 group-hover:scale-105",
              isLanding ? "border-slate-950/10 bg-slate-950/[0.04]" : "border-slate-200 bg-slate-50"
            )}>
              <Ghost className={cn("h-5 w-5 transition-transform duration-300 group-hover:rotate-6", isLanding ? "text-slate-800" : "text-slate-900")} />
              {!isLanding && (
                <span
                  className="absolute -inset-1.5 rounded-2xl opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: "radial-gradient(circle, rgba(30,20,70,0.12) 0%, rgba(30,20,70,0.05) 50%, transparent 70%)" }}
                />
              )}
            </span>
            <span className={cn("text-[15px] font-bold tracking-tight", isLanding ? "text-slate-900" : "text-slate-900")}>
              Ghost<span className={isLanding ? "bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent" : "gradient-text"}>Customer</span>
            </span>
          </Link>

          {/* Center nav (segmented) */}
          <nav className={cn(
            "absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border p-1 md:flex",
            isLanding
              ? "border-slate-900/[0.06] bg-slate-900/[0.04] shadow-[inset_0_1px_2px_rgba(15,15,40,0.05)]"
              : "border-slate-200 bg-slate-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
          )}>
            {NAV.map((item) => {
              const active = pathname?.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-200",
                    isLanding
                      ? active ? "text-violet-700" : "text-slate-500 hover:text-slate-900"
                      : active ? "text-slate-900" : "text-slate-500 hover:text-slate-900",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className={cn(
                        "absolute inset-0 -z-10 rounded-full",
                        isLanding
                          ? "bg-white ring-1 ring-slate-900/[0.05]"
                          : "bg-white ring-1 ring-slate-200"
                      )}
                      style={
                        isLanding
                          ? { boxShadow: "0 1px 3px rgba(20,16,50,0.14), 0 1px 2px rgba(20,16,50,0.08)" }
                          : { boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14), 0 6px 16px -6px rgba(30,20,70,0.12)" }
                      }
                      transition={{ type: "spring", stiffness: 360, damping: 30 }}
                    />
                  )}
                  <Icon className={cn("h-3.5 w-3.5 align-middle", isLanding && active && "text-violet-600")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions & Mobile Toggle */}
          <div className="flex items-center gap-2">
            <UserMenu />
            <Link
              href="/dashboard"
              className={cn(
                "relative overflow-hidden rounded-xl px-3.5 py-1.5 text-xs font-semibold shadow-sm transition-all duration-300 hover:-translate-y-0.5 sm:px-4 sm:py-2 sm:text-sm group",
                isLanding
                  ? "bg-violet-600 text-white hover:bg-violet-700 shadow-[0_4px_12px_rgba(124,58,237,0.2)] hover:shadow-[0_4px_20px_rgba(124,58,237,0.35)]"
                  : "bg-slate-900 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_8px_24px_-6px_rgba(30,20,70,0.35)]"
              )}
            >
              {!isLanding && <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.15] to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />}
              <span className="relative z-10">Launch</span>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-xl border md:hidden transition-colors",
                isLanding
                  ? "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              )}
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
              className={cn(
                "mt-2.5 overflow-hidden rounded-2xl border p-2.5 backdrop-blur-2xl md:hidden",
                isLanding
                  ? "border-slate-200 bg-white/95 shadow-[0_20px_50px_rgba(0,0,0,0.1)] text-slate-800"
                  : "border-slate-200 bg-white/95 shadow-[0_20px_50px_rgba(30,20,70,0.12)] text-slate-900"
              )}
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
                          ? isLanding
                            ? "bg-violet-600/10 text-violet-700 ring-1 ring-violet-500/20"
                            : "bg-gradient-to-r from-violet-600/15 to-indigo-600/10 text-violet-700 ring-1 ring-violet-500/30"
                          : isLanding
                            ? "text-slate-600 hover:bg-slate-50 text-slate-900"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
                      )}
                    >
                      <Icon className={cn("h-4 w-4", active ? (isLanding ? "text-violet-600" : "text-violet-600") : (isLanding ? "text-slate-400" : "text-slate-400"))} />
                      <span className="flex-1">{item.label}</span>
                      {active && <span className={cn("h-1.5 w-1.5 rounded-full", isLanding ? "bg-violet-600" : "bg-violet-600")} />}
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

