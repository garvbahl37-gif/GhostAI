"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2500; // 2.5 seconds total loading time
    const interval = 50;
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += interval;
      const raw = elapsed / duration;
      const eased = Math.pow(raw, 0.8);
      setProgress(Math.min(100, Math.floor(eased * 100)));
      if (elapsed >= duration) {
        clearInterval(timer);
        setTimeout(() => setIsLoading(false), 300);
      }
    }, interval);
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0B0F19] overflow-hidden w-full h-full"
        >
          {/* Ambient Glowing Mesh Gradient */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/15 blur-[120px]" />
            <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-500/15 blur-[120px]" />
          </div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
            className="z-10 mb-8 font-sans text-5xl tracking-[0.2em] md:text-7xl lg:text-8xl font-light"
          >
            <span className="bg-gradient-to-br from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
              GHOST AI
            </span>
          </motion.h1>

          <div className="z-10 flex w-full max-w-md flex-col items-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-4 flex flex-col items-center gap-3 w-full"
            >
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-gray-400">
                Initializing Agent Swarm...
              </span>
            </motion.div>

            {/* Tiny, elegant progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="w-48 h-[2px] bg-gray-800 rounded-full overflow-hidden relative mb-4"
            >
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="font-mono text-xs tracking-widest text-white/40"
            >
              {progress.toString().padStart(3, '0')}%
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
