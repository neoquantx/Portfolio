import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { terminalSound } from '../../utils/terminalSound';
import { portfolioData } from '../../config/portfolio';

const COMMANDS = {
  help: () => [
    { text: '─────────────────── AVAILABLE COMMANDS ───────────────────', cls: 'text-[#00f0ff]/70' },
    { text: '  help          Show this command list', cls: '' },
    { text: '  whoami        Display current user info', cls: '' },
    { text: '  ls            List available sections', cls: '' },
    { text: '  projects      List deployed projects', cls: '' },
    { text: '  skills        Show skill matrix', cls: '' },
    { text: '  about         About the developer', cls: '' },
    { text: '  socials       External links', cls: '' },
    { text: '  clear         Clear terminal', cls: '' },
    { text: '  sudo overclock  [RESTRICTED] Activate override mode', cls: 'text-amber-400' },
    { text: '  sudo hire himanshu  [SMART] Initiate recruitment uplink', cls: 'text-emerald-400' },
    { text: '─────────────────────────────────────────────────────────────', cls: 'text-[#00f0ff]/70' },
  ],
  whoami: () => [
    { text: 'guest_user [ PRIVILEGE: READ_ONLY | STATUS: UNAUTHORIZED ]', cls: 'text-amber-400' },
  ],
  ls: () => [
    { text: 'identity/   deployments/   skills/   achievements/   contact/', cls: 'text-[#00f0ff]' },
  ],
  projects: () => [
    { text: '[ DEPLOYED PROJECTS ]', cls: 'text-[#00f0ff] font-bold' },
    ...portfolioData.projects.flatMap((p, i) => [
      { text: `#0${i+1} ${p.title}`, cls: 'text-white font-bold mt-1' },
      { text: `     ${p.techStack.join(' · ')}`, cls: 'text-[#00f0ff]/60 text-[10px]' },
    ]),
  ],
  skills: () => {
    const cats = [...new Set(portfolioData.skills.map(s => s.category))];
    return [
      { text: '[ SKILL MATRIX ]', cls: 'text-[#00f0ff] font-bold' },
      ...cats.flatMap(cat => {
        const sk = portfolioData.skills.filter(s => s.category === cat);
        return [
          { text: `\n  ▸ ${cat.toUpperCase()}`, cls: 'text-[#00f0ff]/80 font-bold' },
          ...sk.map(s => {
            const bars = Math.round(s.level / 10);
            return { text: `    ${s.name.padEnd(16)} ${'█'.repeat(bars)}${'░'.repeat(10-bars)} ${s.level}%`, cls: s.level >= 80 ? 'text-[#00f0ff]' : 'text-slate-400' };
          }),
        ];
      }),
    ];
  },
  about: () => [
    { text: `[ ${portfolioData.personal.name.toUpperCase()} ]`, cls: 'text-[#00f0ff] font-bold' },
    { text: `ROLE:     ${portfolioData.personal.title}`, cls: 'text-white' },
    { text: `LOCATION: ${portfolioData.personal.location}`, cls: '' },
    { text: `BIO:      ${portfolioData.personal.bio}`, cls: 'text-slate-400 leading-relaxed' },
  ],
  socials: () => [
    { text: '[ EXTERNAL UPLINKS ]', cls: 'text-[#00f0ff] font-bold' },
    ...portfolioData.socials.map(s => ({ text: `  > ${s.name.padEnd(10)} ${s.url}`, cls: 'text-slate-300 underline' })),
  ],
};

export default function TerminalEasterEgg({ setIsOverclocked }) {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([
    { text: 'NeoQuantX Terminal OS v2.4.1 — Type "help" for commands.', cls: 'text-[#00f0ff]/80' },
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isOpen]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  const addLines = (newLines) => setHistory(prev => [...prev, ...newLines]);

  const handleCommand = (e) => {
    if (e.key !== 'Enter') return;
    const cmd = input.trim().toLowerCase();
    setInput('');

    // Echo input
    addLines([{ text: `> ${input}`, cls: 'text-[#ff0055]' }]);
    try { terminalSound.playCommandEnter(); } catch(er) {}

    if (cmd === 'clear') { setHistory([]); return; }
    if (cmd === 'sudo overclock') {
      addLines([{ text: 'OVERRIDE ACCEPTED — OVERCLOCKING SYSTEM...', cls: 'text-emerald-400 font-bold' }]);
      setIsOverclocked(true);
      try { terminalSound.playBootBleep(3); } catch(er) {}
      return;
    }
    if (cmd === 'sudo hire himanshu') {
      addLines([
        { text: 'ACCESS GRANTED — Initiating recruitment uplink...', cls: 'text-emerald-400 font-bold' },
        { text: `Routing to: ${portfolioData.personal.email}`, cls: 'text-[#00f0ff]' },
        { text: 'Scroll to CONNECT section or use the Contact terminal to reach out.', cls: 'text-slate-400' },
      ]);
      try { terminalSound.playSuccessChime(); } catch(er) {}
      return;
    }
    if (cmd.startsWith('sudo')) {
      addLines([{ text: 'Access Denied. Quantum firewall rejected privilege escalation.', cls: 'text-rose-500 font-bold' }]);
      try { terminalSound.playAccessDeniedBuzzer(); } catch(er) {}
      return;
    }
    if (cmd === '') return;

    const fn = COMMANDS[cmd];
    if (fn) {
      addLines(fn());
    } else {
      addLines([{ text: `command not found: ${cmd}. Type "help".`, cls: 'text-slate-500' }]);
    }
  };

  return (
    // Centred at the bottom, never overlaps OVERRIDE or sound/theme buttons
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: 10 }}
            animate={{ height: 'min(35vh, 300px)', opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-[min(90vw,680px)] bg-slate-950/97 border border-t border-l border-r border-[#00f0ff]/30 backdrop-blur-lg rounded-t-xl overflow-hidden flex flex-col shadow-[0_-10px_40px_rgba(0,240,255,0.15)]"
          >
            {/* Terminal header bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#00f0ff]/20 bg-slate-900/80 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse shadow-[0_0_6px_#00f0ff]" />
                <span className="text-[10px] font-mono text-[#00f0ff]/70 tracking-widest">NX-TERMINAL</span>
              </div>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
              </div>
            </div>

            {/* Output area */}
            <div className="flex-1 overflow-y-auto px-4 py-3 font-mono text-xs text-slate-400 custom-scrollbar">
              {history.map((line, i) => (
                <div key={i} className={`leading-relaxed whitespace-pre-wrap ${line.cls || ''}`}>
                  {line.text}
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {/* Input row */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-t border-[#00f0ff]/20 bg-slate-900/60 shrink-0">
              <span className="text-[#ff0055] font-bold font-mono text-xs shrink-0">guest@nx:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleCommand}
                className="bg-transparent border-none outline-none flex-1 text-[#00f0ff] font-mono text-xs caret-[#00f0ff]"
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button — always visible, centered */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className={`flex items-center gap-2 px-4 py-2 font-mono text-[11px] font-bold tracking-widest transition-all duration-300 border ${
          isOpen
            ? 'bg-[#00f0ff]/15 border-[#00f0ff]/60 text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.3)] rounded-t-none'
            : 'bg-slate-950/80 border-[#00f0ff]/30 text-[#00f0ff]/70 hover:text-[#00f0ff] hover:border-[#00f0ff]/60 shadow-[0_-4px_20px_rgba(0,240,255,0.1)] rounded-t-lg'
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-[#00f0ff] animate-ping' : 'bg-[#00f0ff]/50'}`} />
        {isOpen ? 'CLOSE_TERMINAL' : '>_ TERMINAL'}
      </button>
    </div>
  );
}
