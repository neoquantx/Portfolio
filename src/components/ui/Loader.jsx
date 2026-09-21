import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { terminalSound } from '../../utils/terminalSound';

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
  const [hasStarted, setHasStarted] = useState(false);
  const [lines, setLines] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;

    let currentIndex = 0;
    let timeout;

    try {
      terminalSound.init();
      terminalSound.toggleSound(true);
    } catch(e) {}

    const addLine = () => {
      if (currentIndex < bootSequence.length) {
        const text = bootSequence[currentIndex]; // capture before increment
        if (typeof text === 'string') {
          setLines(prev => [...prev, text]);
        }
        try { terminalSound.playKeyClick(); } catch(e) {}
        currentIndex++;
        const delay = Math.random() * 80 + 25;
        timeout = setTimeout(addLine, delay);
      } else {
        setGlitch(true);
        try { terminalSound.playCommandEnter(); } catch(e) {}
        setTimeout(() => setIsComplete(true), 600);
      }
    };

    timeout = setTimeout(addLine, 300);
    return () => clearTimeout(timeout);
  }, [hasStarted]);

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

          {!hasStarted ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-20">
              <div className="text-[#00f0ff]/40 text-[10px] tracking-[0.5em] uppercase mb-2">
                Neoquantx Portfolio OS
              </div>
              <button
                onClick={() => setHasStarted(true)}
                className="relative px-8 py-3.5 border-2 border-[#00f0ff] text-[#00f0ff] text-sm font-bold uppercase tracking-[0.3em] transition-all duration-300 hover:bg-[#00f0ff] hover:text-[#020617] shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:shadow-[0_0_40px_rgba(0,240,255,0.7)]"
              >
                INITIALIZE SYSTEM
              </button>
              <motion.div
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
                className="text-[#00f0ff]/50 text-[10px] tracking-widest"
              >
                — PRESS TO BOOT —
              </motion.div>
            </div>
          ) : (
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
              <motion.div
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.7 }}
                className="w-2.5 h-[1.1em] bg-[#00f0ff] mt-1 inline-block"
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
