import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { terminalSound } from '../../utils/terminalSound';
import LoadingSpinner from '../shitui/LoadingSpinner';

// Dynamic BIOS date from today
const getBiosDate = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const yy = String(now.getFullYear()).slice(2);
  return `${pad(now.getMonth()+1)}/${pad(now.getDate())}/${yy} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
};

const bootSequence = [
  `BIOS Date ${getBiosDate()} Ver 2.01.12`,
  'CPU: Quantum Core Processor @ 8.4 GHz',
  'Memory Test: 2097152K OK',
  'Initializing Kernel...',
  'Loading neural link modules................[OK]',
  'Mounting virtual DOM drives................[OK]',
  'Establishing WebGL Context.................[OK]',
  'Compiling Nanobot Swarm Shaders............[OK]',
  'Decrypting Identity Matrix.................[OK]',
  'Bypassing security protocols...............[WARNING]',
  'Override successful.',
  'Starting Main OS...',
  '> SYSTEM ONLINE. WELCOME.'
];

const Loader = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [glitch, setGlitch] = useState(false);

  // Auto-boot: no click gate. Sound never blocks boot.
  useEffect(() => {
    let currentIndex = 0;
    let timeout;
    let doneTimeout;
    let cancelled = false;

    try {
      terminalSound.init();
      // SoundToggle owns sound state after user gesture; never force on here
    } catch(e) {}

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setLines([...bootSequence]);
      setGlitch(true);
      doneTimeout = setTimeout(() => { if (!cancelled) setIsComplete(true); }, 350);
      return () => { cancelled = true; if (doneTimeout) clearTimeout(doneTimeout); };
    }

    const addLine = () => {
      if (cancelled) return;
      if (currentIndex < bootSequence.length) {
        const text = bootSequence[currentIndex]; // capture before increment
        if (typeof text === 'string') {
          setLines(prev => [...prev, text]);
        }
        currentIndex++;
        const isMobile = window.innerWidth < 768;
        const delay = isMobile ? Math.random() * 30 + 12 : Math.random() * 70 + 22;
        timeout = setTimeout(addLine, delay);
      } else {
        setGlitch(true);
        doneTimeout = setTimeout(() => { if (!cancelled) setIsComplete(true); }, 400);
      }
    };

    timeout = setTimeout(addLine, 120);
    return () => { cancelled = true; if (timeout) clearTimeout(timeout); if (doneTimeout) clearTimeout(doneTimeout); };
  }, []);

  const handleSkip = () => {
    setLines([...bootSequence]);
    setGlitch(true);
    setIsComplete(true);
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' || e.key === ' ') handleSkip(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!isComplete && (
        <motion.div
          className={`fixed inset-0 z-[9999] bg-[#020617] text-[#00f0ff] font-mono text-xs sm:text-sm overflow-hidden flex flex-col justify-end p-6 sm:p-10 ${glitch ? 'animate-glitch' : ''}`}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.06,
            filter: 'contrast(200%) blur(8px) brightness(250%)',
            transition: { duration: 0.7, ease: 'easeIn' }
          }}
        >
          {/* CRT Scanlines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.28)_50%),linear-gradient(90deg,rgba(255,0,0,0.05),rgba(0,255,0,0.02),rgba(0,0,255,0.05))] bg-[length:100%_4px,3px_100%] pointer-events-none z-10 opacity-50" />

          {/* Corner decorators */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#00f0ff]/60 pointer-events-none" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#00f0ff]/60 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#00f0ff]/60 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#00f0ff]/60 pointer-events-none" />

          {/* Top label */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-[#00f0ff]/50 tracking-[0.4em] uppercase pointer-events-none">
            N.I.M.B.U.S OS — v9.0.1
          </div>

          {/* Skip — never trap the user */}
          <button
            onClick={handleSkip}
            aria-label="Skip boot sequence"
            className="absolute top-16 right-4 sm:top-5 sm:right-5 z-30 px-3.5 py-2 min-h-[44px] border border-[#00f0ff]/40 text-[#00f0ff]/80 text-[10px] font-mono tracking-[0.25em] uppercase hover:bg-[#00f0ff]/10 hover:text-[#00f0ff] transition-colors"
          >
            SKIP ▸
          </button>

          <div className="flex flex-col gap-0.5 relative z-20 w-full max-w-2xl">
            {lines.filter(Boolean).map((line, i) => {
              const isLast = i === lines.length - 1;
              const isWarning = line?.includes('[WARNING]');
              const isOk = line?.includes('[OK]');
              const isOnline = line?.includes('ONLINE');
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.1 }}
                  className={`leading-relaxed ${
                    isOnline ? 'text-white font-bold text-base' :
                    isWarning ? 'text-amber-400' :
                    isOk ? 'text-emerald-400' :
                    isLast ? 'text-white font-semibold animate-pulse' :
                    'text-[#00f0ff]/70'
                  }`}
                >
                  <span className="text-slate-600 mr-3 select-none">[{String(i).padStart(2,'0')}]</span>
                  {line}
                </motion.div>
              );
            })}
            <div className="mt-3 flex items-center gap-3">
              <LoadingSpinner text="BOOTING N.I.M.B.U.S" size="sm" className="boot-spinner font-mono" />
              <motion.div
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.7 }}
                className="w-2.5 h-[1.1em] bg-[#00f0ff] inline-block"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
