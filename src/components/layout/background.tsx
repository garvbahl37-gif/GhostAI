"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export function Background() {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 60, damping: 22 });
  const sy = useSpring(my, { stiffness: 60, damping: 22 });

  const x1 = useTransform(sx, [0, 1], [-22, 22]);
  const y1 = useTransform(sy, [0, 1], [-18, 18]);
  const x2 = useTransform(sx, [0, 1], [16, -16]);
  const y2 = useTransform(sy, [0, 1], [12, -12]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth);
      my.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  if (isLanding) {
    return (
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Light SaaS base background */}
        <div className="absolute inset-0 bg-[#FAF9FB]" />

        {/* Ambient glows - soft purple/indigo/blue on the right and center */}
        <motion.div style={{ x: x1, y: y1 }} className="absolute inset-0">
          {/* Strong purple glow on the right top */}
          <div
            className="absolute -right-[10%] top-[5%] h-[50rem] w-[50rem] rounded-full blur-[150px]"
            style={{
              background: "radial-gradient(circle, rgba(168,85,247,0.7) 0%, rgba(99,102,241,0.4) 50%, transparent 70%)",
              animation: "ambient-drift 22s ease-in-out infinite",
              mixBlendMode: "multiply"
            }}
          />
          {/* Soft blue/cyan glow in the center-right */}
          <div
            className="absolute right-[20%] bottom-[10%] h-[40rem] w-[40rem] rounded-full blur-[130px]"
            style={{
              background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(6,182,212,0.05) 50%, transparent 70%)",
              animation: "ambient-drift 26s ease-in-out infinite reverse"
            }}
          />
        </motion.div>

        <motion.div style={{ x: x2, y: y2 }} className="absolute inset-0">
          {/* Purple glow on the left bottom */}
          <div
            className="absolute -left-[10%] bottom-[-10%] h-[45rem] w-[45rem] rounded-full blur-[160px]"
            style={{
              background: "radial-gradient(circle, rgba(168,85,247,0.6) 0%, rgba(139,92,246,0.3) 40%, transparent 70%)",
              animation: "ambient-drift 28s ease-in-out infinite",
              mixBlendMode: "multiply"
            }}
          />
        </motion.div>

        {/* fine grid with light grey/indigo grid lines */}
        <div className="absolute inset-0 grid-bg-light opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

        {/* subtle grain */}
        <div className="absolute inset-0 grain opacity-[0.015] mix-blend-overlay" />
      </div>
    );
  }

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* graphite base */}
      <div className="absolute inset-0 bg-[#050506]" />

      {/* ambient graphite light — monochrome, very subtle */}
      <motion.div style={{ x: x1, y: y1 }} className="absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[44rem] w-[44rem] rounded-full bg-white/[0.05] blur-[150px]" style={{ animation: "ambient-drift 22s ease-in-out infinite" }} />
        <div className="absolute right-[-12rem] top-[20%] h-[34rem] w-[34rem] rounded-full bg-white/[0.035] blur-[150px]" style={{ animation: "ambient-drift 26s ease-in-out infinite reverse" }} />
      </motion.div>
      <motion.div style={{ x: x2, y: y2 }} className="absolute inset-0">
        <div className="absolute bottom-[-14rem] left-1/3 h-[34rem] w-[34rem] rounded-full bg-white/[0.03] blur-[160px]" style={{ animation: "ambient-drift 28s ease-in-out infinite" }} />
        {/* one faint signal-blue whisper for life */}
        <div className="absolute bottom-[12%] right-[10%] h-[22rem] w-[22rem] rounded-full bg-[#d6d6da]/[0.05] blur-[150px]" style={{ animation: "ambient-drift 24s ease-in-out infinite reverse" }} />
      </motion.div>

      {/* fine grid */}
      <div className="absolute inset-0 grid-bg opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />

      {/* grain */}
      <div className="absolute inset-0 grain opacity-[0.05] mix-blend-overlay" />

      {/* vignette + bottom fade */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_48%,rgba(0,0,0,0.6))]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-[#050506]" />
    </div>
  );
}

