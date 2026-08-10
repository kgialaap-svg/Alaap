import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const NOTE_SYMBOLS = ['♪', '♫', '♩', '♬', '♭', '♯', '🎼', '🎶', '🎤', '🎧'];
const NOTE_COLORS = ['#d0bcff', '#2fd9f4', '#bec6e0', '#a078ff', '#00fbff'];

export default function CustomCursor() {
  const cursorDotRef = useRef(null);
  const cursorHaloRef = useRef(null);

  const posRef = useRef({ x: -100, y: -100 });
  const trailRef = useRef({ x: -100, y: -100 });
  
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [particles, setParticles] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || matchMedia('(pointer: coarse)').matches) {
      return;
    }

    setIsVisible(true);
    document.body.classList.add('has-custom-cursor');

    let particleCount = 0;

    const spawnParticle = (x, y, isBurst = false) => {
      const symbol = NOTE_SYMBOLS[Math.floor(Math.random() * NOTE_SYMBOLS.length)];
      const color = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
      const size = 14 + Math.random() * 12;
      const vx = isBurst ? (Math.random() - 0.5) * 60 : (Math.random() - 0.5) * 28;
      const vy = isBurst ? (Math.random() - 0.5) * 60 - 20 : -35 - Math.random() * 30;
      const rotation = (Math.random() - 0.5) * 40;

      const p = {
        id: particleCount++,
        x,
        y,
        symbol,
        color,
        size,
        vx,
        vy,
        rotation,
      };

      setParticles((prev) => [...prev.slice(-25), p]);
    };

    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e) => {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;

      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      if (dist > 30) {
        lastX = e.clientX;
        lastY = e.clientY;
        spawnParticle(e.clientX, e.clientY);
      }

      const target = e.target;
      if (target) {
        const interactive = !!target.closest(
          'button, a, input, select, textarea, [role="button"], .glass-card, .cursor-pointer'
        );
        setIsHovered(interactive);
      }
    };

    const handleMouseDown = (e) => {
      setIsClicked(true);
      for (let i = 0; i < 6; i++) {
        spawnParticle(e.clientX, e.clientY, true);
      }
    };

    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    let animationFrameId;
    const animateCursor = () => {
      const px = posRef.current.x;
      const py = posRef.current.y;

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${px - 6}px, ${py - 6}px, 0)`;
      }

      trailRef.current.x += (px - trailRef.current.x) * 0.22;
      trailRef.current.y += (py - trailRef.current.y) * 0.22;

      if (cursorHaloRef.current) {
        cursorHaloRef.current.style.transform = `translate3d(${trailRef.current.x - 20}px, ${trailRef.current.y - 20}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(animateCursor);
    };

    animationFrameId = requestAnimationFrame(animateCursor);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    if (!isHovered || !isVisible) return;

    const interval = setInterval(() => {
      const px = posRef.current.x;
      const py = posRef.current.y;
      if (px > 0 && py > 0) {
        const symbol = NOTE_SYMBOLS[Math.floor(Math.random() * NOTE_SYMBOLS.length)];
        const color = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
        const size = 16 + Math.random() * 14;
        const vx = (Math.random() - 0.5) * 32;
        const vy = -40 - Math.random() * 35;
        const rotation = (Math.random() - 0.5) * 50;

        const p = {
          id: Date.now() + Math.random(),
          x: px,
          y: py,
          symbol,
          color,
          size,
          vx,
          vy,
          rotation,
        };

        setParticles((prev) => [...prev.slice(-30), p]);
      }
    }, 140);

    return () => clearInterval(interval);
  }, [isHovered, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[999] overflow-hidden select-none">
      <motion.div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-3 h-3 bg-tertiary rounded-full shadow-[0_0_15px_#2fd9f4] mix-blend-screen pointer-events-none"
        animate={{
          scale: isClicked ? 0.6 : isHovered ? 1.8 : 1,
          backgroundColor: isHovered ? '#d0bcff' : '#2fd9f4',
        }}
        transition={{ duration: 0.15 }}
      />

      <motion.div
        ref={cursorHaloRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-primary/60 shadow-[0_0_20px_rgba(208,188,255,0.4)] pointer-events-none"
        animate={{
          scale: isClicked ? 1.4 : isHovered ? 2.2 : 1,
          borderColor: isHovered ? '#2fd9f4' : 'rgba(208, 188, 255, 0.6)',
          backgroundColor: isHovered ? 'rgba(47, 217, 244, 0.12)' : 'transparent',
        }}
        transition={{ duration: 0.18 }}
      />

      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              opacity: 0.95,
              scale: 0.7,
              x: p.x - 8,
              y: p.y - 12,
              rotate: 0,
            }}
            animate={{
              opacity: 0,
              scale: 1.6,
              x: p.x - 8 + p.vx,
              y: p.y - 12 + p.vy,
              rotate: p.rotation,
            }}
            transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
            onAnimationComplete={() => {
              setParticles((prev) => prev.filter((item) => item.id !== p.id));
            }}
            className="fixed font-bold font-sans select-none pointer-events-none"
            style={{
              fontSize: `${p.size}px`,
              color: p.color,
              filter: `drop-shadow(0 0 8px ${p.color})`,
            }}
          >
            {p.symbol}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
