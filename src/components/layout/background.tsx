"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export function Background() {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });

  // parallax offsets at two depths
  const x1 = useTransform(sx, [0, 1], [-30, 30]);
  const y1 = useTransform(sy, [0, 1], [-24, 24]);
  const x2 = useTransform(sx, [0, 1], [22, -22]);
  const y2 = useTransform(sy, [0, 1], [18, -18]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth);
      my.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* deep base */}
      <div className="absolute inset-0 bg-[#05050c]" />

      {/* aurora mesh */}
      <motion.div style={{ x: x1, y: y1 }} className="absolute inset-0">
        <div className="absolute -left-48 -top-40 h-[42rem] w-[42rem] rounded-full bg-ghost-violet/25 blur-[140px]" style={{ animation: "aurora-shift 16s ease-in-out infinite" }} />
        <div className="absolute right-[-14rem] top-[18%] h-[38rem] w-[38rem] rounded-full bg-ghost-cyan/20 blur-[140px]" style={{ animation: "aurora-shift 20s ease-in-out infinite reverse" }} />
      </motion.div>
      <motion.div style={{ x: x2, y: y2 }} className="absolute inset-0">
        <div className="absolute bottom-[-16rem] left-1/4 h-[40rem] w-[40rem] rounded-full bg-ghost-rose/15 blur-[150px]" style={{ animation: "aurora-shift 22s ease-in-out infinite" }} />
        <div className="absolute bottom-[10%] right-[8%] h-[26rem] w-[26rem] rounded-full bg-ghost-indigo/20 blur-[130px]" style={{ animation: "aurora-shift 18s ease-in-out infinite reverse" }} />
      </motion.div>

      {/* animated grid with radial fade */}
      <div className="absolute inset-0 grid-bg opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />

      {/* grain */}
      <div className="absolute inset-0 grain opacity-[0.06] mix-blend-overlay" />

      {/* vignette + bottom fade */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.55))]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-background" />
    </div>
  );
}
