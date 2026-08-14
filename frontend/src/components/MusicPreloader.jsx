import React, { useEffect, useState } from 'react';
import alaapLogoDark from '../assets/allap_logo_dark.png';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Sparkles } from 'lucide-react';

export default function MusicPreloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('TUNING FREQUENCIES...');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    const DURATION_MS = 3500; // 3.5 seconds total loading time

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min(Math.floor((elapsed / DURATION_MS) * 100), 100);

      setProgress(calculatedProgress);

      if (calculatedProgress > 25 && calculatedProgress < 55) {
        setStatusText('HARMONIZING 3D STAGE...');
      } else if (calculatedProgress >= 55 && calculatedProgress < 85) {
        setStatusText('COMPOSING RESIDUAL ECHOES...');
      } else if (calculatedProgress >= 85 && calculatedProgress < 100) {
        setStatusText('FINALIZING RESONANCE...');
      } else if (calculatedProgress >= 100) {
        setStatusText('RHYTHM READY');
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
          onComplete?.();
        }, 500);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] }
          }}
          className="fixed inset-0 z-[100] bg-[#0f0d15] flex flex-col items-center justify-center p-6 select-none"
        >
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/15 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-tertiary/15 rounded-full blur-[120px] animate-pulse delay-500" />

          <div className="relative z-10 flex flex-col items-center space-y-6 max-w-md text-center">
            {/* 1-2 Word Welcome Banner */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full border border-tertiary/40 bg-tertiary/10 text-tertiary font-mono text-xs tracking-widest uppercase font-bold shadow-[0_0_20px_rgba(208,188,255,0.3)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-tertiary animate-pulse" />
              WELCOME
            </motion.div>
            {/* Native Dark Mode Logo Container */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
              {/* Logo Card Badge */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border border-primary/40 p-1.5 bg-[#090812] shadow-2xl flex items-center justify-center"
              >
                <img
                  src={alaapLogoDark}
                  alt="'Alaap' The Music Club Official Dark Logo"
                  className="w-full h-full object-contain rounded-xl"
                />
              </motion.div>
            </div>

            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-mono text-tertiary uppercase tracking-widest block font-bold neon-glow-tertiary">
                Kashi Group of Institutions
              </span>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-sans text-4xl sm:text-5xl font-black tracking-wider text-primary neon-glow-primary"
              >
                'Alaap'
              </motion.h1>
              <p className="font-mono text-sm text-on-surface-variant tracking-widest uppercase font-semibold">
                The Music Club
              </p>
            </div>

            <div className="flex items-end justify-center gap-1.5 h-10 px-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 rounded-full bg-gradient-to-t from-tertiary to-primary"
                  animate={{
                    height: ['6px', `${14 + (i % 5) * 6}px`, '28px', '8px'],
                  }}
                  transition={{
                    duration: 0.6 + (i % 4) * 0.15,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    delay: i * 0.08,
                  }}
                />
              ))}
            </div>

            <div className="w-full space-y-3 pt-2">
              {/* Outer Loading Bar Track */}
              <div className="relative w-full bg-[#1c1825] rounded-full h-2.5 sm:h-3 overflow-hidden p-0 border border-tertiary/25 shadow-inner">
                {/* Background track subtle glow */}
                <div className="absolute inset-0 bg-tertiary/5 rounded-full" />

                {/* Animated Color Filled Loading Bar */}
                <motion.div
                  className="relative h-full bg-tertiary bg-gradient-to-r from-primary via-tertiary to-primary rounded-full shadow-[0_0_12px_rgba(47,217,244,0.8),0_0_20px_rgba(208,188,255,0.5)] transition-all duration-150"
                  style={{ width: `${progress > 0 ? Math.max(progress, 2) : 0}%` }}
                  transition={{ ease: 'easeOut' }}
                >
                  {/* Leading edge light beam effect */}
                  {progress > 0 && progress < 100 && (
                    <div className="absolute top-0 right-0 h-full w-2 bg-white/80 rounded-full blur-[1px] shadow-[0_0_8px_#ffffff]" />
                  )}
                </motion.div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-tertiary flex items-center gap-1">
                  <Sparkles className="w-3 h-3 animate-spin" />
                  {statusText}
                </span>
                <span className="text-primary font-bold">{progress}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
