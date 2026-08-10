import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import alaapLogoDark from '../assets/allap_logo_dark.png';

export default function Hero({ onExploreClick }) {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden select-none">
      {/* Animated Background Gradients & Glows */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-tertiary/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background" />

        {/* Abstract Responsive Waveform */}
        <svg
          className="absolute bottom-0 left-0 w-full h-48 text-primary/15"
          preserveAspectRatio="none"
          viewBox="0 0 1440 320"
        >
          <path
            className="stroke-primary/30 fill-none"
            strokeWidth="2"
            strokeDasharray="8 4"
            d="M0,160 Q180,240 360,180 T720,200 T1080,140 T1440,220"
          />
          <path
            className="stroke-tertiary/30 fill-none"
            strokeWidth="1.5"
            d="M0,200 Q200,120 400,220 T800,160 T1200,240 T1440,150"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 space-y-8 max-w-4xl mx-auto px-4">
        {/* Grand Official Dark Mode Logo Emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center gap-3"
        >
          <div className="relative group cursor-pointer">
            {/* Ambient Multi-color Glowing Halo */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary via-tertiary to-secondary blur-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />

            {/* Native Dark Theme Logo Badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-3xl overflow-hidden border border-primary/40 bg-[#090812] p-2 shadow-[0_0_50px_rgba(208,188,255,0.4)] backdrop-blur-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500"
            >
              <img
                src={alaapLogoDark}
                alt="'Alaap' The Music Club Official Dark Logo"
                className="w-full h-full object-contain rounded-2xl"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Established Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-block"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-tertiary/20 bg-tertiary/5 text-tertiary font-mono text-xs tracking-widest rhythmic-bounce">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
            ON AIR
          </div>
        </motion.div>

        {/* Catchy Headline */}
        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-sans text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-on-surface leading-tight"
        >
          Where <span className="text-primary neon-glow-primary">melodies</span> meet <span className="text-tertiary neon-glow-tertiary">minds</span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-body text-base sm:text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed"
        >
          Welcome to Alaap. A music community where college talent transforms into rhythmic reality. Join the symphony of the next generation.
        </motion.p>
      </div>
    </section>
  );
}
