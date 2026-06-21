"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hourglass } from "lucide-react";
import SoftAurora from "@/components/ui/soft-aurora";
import Aurora from "@/components/ui/aurora";

export function LandingEffects() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2500; // 2.5 seconds total loading time
    const interval = 50;
    const exitDuration = 1200;
    let elapsed = 0;
    let completeTimer: ReturnType<typeof setTimeout>;
    let revealNavbarTimer: ReturnType<typeof setTimeout>;

    const timer = setInterval(() => {
      elapsed += interval;
      // Calculate progress with a slight ease-out feel
      const rawProgress = (elapsed / duration);
      const easedProgress = Math.pow(rawProgress, 0.8); // ease out
      const currentProgress = Math.min(100, Math.floor(easedProgress * 100));

      setProgress(currentProgress);

      if (elapsed >= duration) {
        clearInterval(timer);
        completeTimer = setTimeout(() => {
          setIsLoading(false);
          revealNavbarTimer = setTimeout(() => {
            window.dispatchEvent(new Event("landing-loading-complete"));
          }, exitDuration);
        }, 300); // Wait a tiny bit at 100% before fading
      }
    }, interval);

    return () => {
      clearInterval(timer);
      clearTimeout(completeTimer);
      clearTimeout(revealNavbarTimer);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050506] overflow-hidden"
          >
            {/* Aurora effect — full loading screen canvas, displayed behind text */}
            <div className="pointer-events-none absolute inset-0 z-0 opacity-100">
              <Aurora
                colorStops={["#3B82F6", "#B497CF", "#5227FF"]}
                blend={0.8}
                amplitude={1.5}
                speed={0.8}
              />
            </div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="z-10 mb-8 font-serif text-5xl tracking-[0.25em] text-white/90 md:text-7xl lg:text-8xl"
              style={{ textShadow: "0 0 60px rgba(255,255,255,0.2)" }}
            >
              GHOST <span className="text-[#61b8ff]">AI</span>
            </motion.h1>

            <div className="z-10 flex w-full max-w-md flex-col items-center">
              {/* Thin subtle line */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "16rem", opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="mb-8 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />

              {/* Loading text with icon */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mb-6 flex items-center gap-3 text-muted-foreground/80"
              >
                <Hourglass className="h-3.5 w-3.5 animate-pulse text-[#b49865]" />
                <span className="font-mono text-xs uppercase tracking-[0.3em]">
                  Initializing Swarm...
                </span>
              </motion.div>

              {/* Percentage */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="flex items-center gap-4 font-mono text-sm tracking-widest text-white/60"
              >
                <div className="h-[1px] w-6 bg-gradient-to-r from-transparent to-[#61b8ff]/40" />
                <span className="w-12 text-center">{progress} %</span>
                <div className="h-[1px] w-6 bg-gradient-to-l from-transparent to-[#61b8ff]/40" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-none fixed inset-0 z-0 opacity-80 mix-blend-screen transition-opacity duration-1000">
        <SoftAurora
          speed={0.8}
          scale={1.2}
          brightness={1.8}
          color1="#1e3a8a"
          color2="#ffffff"
          noiseFrequency={2.0}
          noiseAmplitude={1.2}
          bandHeight={0.6}
          bandSpread={1.2}
          octaveDecay={0.15}
          layerOffset={0}
          colorSpeed={1.5}
          enableMouseInteraction={false}
          mouseInfluence={0.25}
        />
      </div>
    </>
  );
}
