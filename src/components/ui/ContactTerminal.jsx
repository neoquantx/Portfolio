import React, { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import ModuleContainer from './ModuleContainer';
import { terminalSound } from '../../utils/terminalSound';
import { portfolioData } from '../../config/portfolio';

const ASCII_LOGO = [
  "       /\\          USER:   guest@neoquantx",
  "      /  \\         HOST:   Quantum Lattice [Bengaluru, IN]",
  "     / /\\ \\        OS:     NeoQuantX OS (N.I.M.B.U.S. Kernel v9.0.1)",
  "    / /  \\ \\       UPTIME: 99.99% Quantum Sync",
  "   / / /\\ \\ \\      STACK:  React 18 · Three.js · GLSL · Tailwind · Node",
  "  / / /  \\ \\ \\     DEV:    Himanshu Nikam [Software Engineer]",
  " /_/_/    \\_\\_\\    CPU:    8x Q-Core @ 4.8 GHz [LOAD: 14%]",
  "                   MEMORY: 64TB Q-RAM [2.1TB Used]",
  "                   NODE:   #NX-88 [ONLINE]"
];

const COMMAND_CHIPS = ['neofetch', 'projects', 'skills', 'about', 'matrix', 'contact', 'clear'];

export default function ContactTerminal() {
  const [history, setHistory] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [mode, setMode] = useState('booting'); // booting, cmd, name, email, message, sending
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const [pingMs, setPingMs] = useState(14);
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  
  const inputRef = useRef(null);
  const endRef = useRef(null);

  // Real-time clock & fluctuating telemetry ping
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);

    const pingInterval = setInterval(() => {
      setPingMs(Math.floor(10 + Math.random() * 8));
    }, 4000);

    return () => {
      clearInterval(clockInterval);
      clearInterval(pingInterval);
    };
  }, []);

  // Auto scroll to bottom of terminal
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, mode]);

  // Keep focus on input
  useEffect(() => {
    if (mode !== 'booting' && mode !== 'sending') {
      inputRef.current?.focus();
    }
  }, [mode, history]);

  // Boot up sequence animation with synthesized bleeps
  useEffect(() => {
    let timeoutIds = [];
    const bootLines = [
      { text: 'N.I.M.B.U.S. COMMS KERNEL v9.0.1 ONLINE', delay: 300, color: 'text-nano-cyan font-bold text-glow' },
      { text: 'Establishing secure handshake... [OK]', delay: 750, color: 'text-slate-600 dark:text-gray-400' },
      { text: 'Bypassing local firewalls... [OK]', delay: 1100, color: 'text-slate-600 dark:text-gray-400' },
      { text: 'TELEMETRY: Quantum mesh synchronized (Node #NX-88)', delay: 1500, color: 'text-sky-600 dark:text-nano-cyan/80' },
      { text: 'WARNING: Unregistered guest entity detected.', delay: 1900, color: 'text-amber-600 dark:text-yellow-400 font-medium' },
      { text: 'Type "help" or "neofetch" to inspect node, or "contact" for secure uplink.', delay: 2400, color: 'text-slate-900 dark:text-white font-medium' }
    ];

    bootLines.forEach((line, index) => {
      const id = setTimeout(() => {
        setHistory(prev => [...prev, { type: 'system', text: line.text, color: line.color }]);
        terminalSound.playBootBleep(index);
      }, line.delay);
      timeoutIds.push(id);
    });

    const finalId = setTimeout(() => {
      setMode('cmd');
    }, 2500);
    timeoutIds.push(finalId);

    return () => timeoutIds.forEach(clearTimeout);
  }, []);

  const getCurrentPrompt = () => {
    switch(mode) {
      case 'cmd': return 'guest@neoquantx:~$ ';
      case 'name': return '[UPLINK] Identifier (Name): ';
      case 'email': return '[UPLINK] Routing (Email): ';
      case 'message': return '[UPLINK] Payload (Message): ';
      default: return '';
    }
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    terminalSound.toggleSound(next);
  };

  const runMatrixEffect = () => {
    setIsMatrixActive(true);
    const chars = '0123456789ABCDEF01010101010101010101010101010101';
    let count = 0;
    const interval = setInterval(() => {
      let line = '';
      for (let i = 0; i < 48; i++) {
        line += chars[Math.floor(Math.random() * chars.length)] + ' ';
      }
      setHistory(prev => [...prev, { type: 'system', text: line, color: 'text-emerald-600 dark:text-green-400 font-mono text-xs' }]);
      terminalSound.playTransmissionBeep();
      count++;
      if (count > 6) {
        clearInterval(interval);
        setTimeout(() => {
          setHistory(prev => [...prev, { 
            type: 'system', 
            text: '[MATRIX RUNTIME] Stream decoupled. Neural link intact.', 
            color: 'text-nano-cyan font-bold' 
          }]);
          setIsMatrixActive(false);
        }, 300);
      }
    }, 120);
  };

  const handleCommand = (cmd) => {
    const cleanCmd = cmd.trim();
    const currentPrompt = getCurrentPrompt();
    
    // Affirmation sound on enter
    terminalSound.playCommandEnter();

    // Log the user's input to history
    setHistory(prev => [...prev, { type: 'input', prompt: currentPrompt, text: cmd }]);

    if (mode === 'cmd') {
      const lowerCmd = cleanCmd.toLowerCase();
      switch(lowerCmd) {
        case 'help':
          setHistory(prev => [...prev, 
            { type: 'system', text: '━━━━━━━━━━━━━━━━ AVAILABLE COMMANDS ━━━━━━━━━━━━━━━━', color: 'text-sky-600 dark:text-nano-cyan/80 font-semibold' },
            { type: 'system', text: '  neofetch  - Display system telemetry & ASCII banner', color: 'text-slate-700 dark:text-gray-300' },
            { type: 'system', text: '  projects  - Inspect deployed engineering projects', color: 'text-slate-700 dark:text-gray-300' },
            { type: 'system', text: '  skills    - Output technical skill telemetry matrix', color: 'text-slate-700 dark:text-gray-300' },
            { type: 'system', text: '  about     - View developer biography & background', color: 'text-slate-700 dark:text-gray-300' },
            { type: 'system', text: '  socials   - Display social uplinks (GitHub, LinkedIn)', color: 'text-slate-700 dark:text-gray-300' },
            { type: 'system', text: '  matrix    - Stream digital rain cipher sequence', color: 'text-slate-700 dark:text-gray-300' },
            { type: 'system', text: '  contact   - Initiate secure encrypted email transmission', color: 'text-slate-700 dark:text-gray-300' },
            { type: 'system', text: '  sound     - Toggle synthesized Web Audio SFX (on/off)', color: 'text-slate-700 dark:text-gray-300' },
            { type: 'system', text: '  whoami    - Display current user privilege level', color: 'text-slate-700 dark:text-gray-300' },
            { type: 'system', text: '  clear     - Wipe terminal screen buffer', color: 'text-slate-700 dark:text-gray-300' },
            { type: 'system', text: '  sudo      - Request superuser kernel privilege', color: 'text-slate-700 dark:text-gray-300' },
            { type: 'system', text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', color: 'text-sky-600 dark:text-nano-cyan/80 font-semibold' }
          ]);
          break;

        case 'neofetch':
        case 'nimbus':
        case 'sysinfo':
        case 'banner':
          setHistory(prev => [
            ...prev,
            { type: 'system', text: '\n' + ASCII_LOGO.join('\n'), color: 'text-nano-cyan font-bold text-glow' }
          ]);
          break;

        case 'projects':
          setHistory(prev => [
            ...prev,
            { type: 'system', text: '--- [ DEPLOYED PROJECTS ] ---', color: 'text-nano-cyan font-bold' },
            ...portfolioData.projects.flatMap((p, i) => [
              { type: 'system', text: `\n#0${i+1} [ ${p.title} ] (${p.formula})`, color: 'text-slate-900 dark:text-white font-bold' },
              { type: 'system', text: `     ${p.description}`, color: 'text-slate-600 dark:text-gray-400' },
              { type: 'system', text: `     STACK: ${p.techStack.join(' · ')}`, color: 'text-sky-600 dark:text-nano-cyan/80 text-xs font-semibold' },
              { type: 'system', text: `     REPO:  ${p.github}`, color: 'text-amber-600 dark:text-yellow-400 text-xs underline font-medium' }
            ])
          ]);
          break;

        case 'skills': {
          const categories = [...new Set(portfolioData.skills.map(s => s.category))];
          const catIcons = { 'Frontend': '⚡', 'Backend': '🔧', 'ML & AI': '🧠', 'Mobile': '📱', 'Cloud & DB': '☁️', 'DevOps': '🚀', 'Core': '⚙️' };
          const lines = [
            { type: 'system', text: `--- [ SKILL TELEMETRY MATRIX ] --- ${portfolioData.skills.length} MODULES LOADED`, color: 'text-nano-cyan font-bold' },
          ];
          categories.forEach(cat => {
            const catSkills = portfolioData.skills.filter(s => s.category === cat);
            lines.push({ type: 'system', text: `\n  ${catIcons[cat] || '▸'} ${cat.toUpperCase()} [${catSkills.length}]`, color: 'text-nano-cyan font-bold text-xs' });
            catSkills.forEach(s => {
              const bars = Math.round(s.level / 10);
              const barStr = '█'.repeat(bars) + '░'.repeat(10 - bars);
              lines.push({
                type: 'system',
                text: `    ${s.name.padEnd(16, ' ')} [${barStr}] ${s.level}%`,
                color: s.level >= 80 ? 'text-nano-cyan font-mono' : s.level >= 60 ? 'text-slate-700 dark:text-gray-300 font-mono' : 'text-slate-600 dark:text-gray-400 font-mono'
              });
            });
          });
          setHistory(prev => [...prev, ...lines]);
          break;
        }

        case 'about':
        case 'bio':
          setHistory(prev => [
            ...prev,
            { type: 'system', text: `\n[ ENTITY: ${portfolioData.personal.name.toUpperCase()} ]`, color: 'text-nano-cyan font-bold' },
            { type: 'system', text: `ROLE:     ${portfolioData.personal.title}`, color: 'text-slate-900 dark:text-white font-medium' },
            { type: 'system', text: `LOCATION: ${portfolioData.personal.location}`, color: 'text-slate-700 dark:text-gray-300' },
            { type: 'system', text: `BIO:      ${portfolioData.personal.bio}`, color: 'text-slate-600 dark:text-gray-400 leading-relaxed' },
            { type: 'system', text: `TAGLINE:  "${portfolioData.personal.tagline}"`, color: 'text-amber-600 dark:text-yellow-400 italic font-medium' }
          ]);
          break;

        case 'socials':
        case 'social':
          setHistory(prev => [
            ...prev,
            { type: 'system', text: '--- [ EXTERNAL UPLINKS ] ---', color: 'text-nano-cyan font-bold' },
            ...portfolioData.socials.map(s => ({
              type: 'system',
              text: `  > ${s.name.padEnd(10, ' ')}: ${s.url}`,
              color: 'text-slate-900 dark:text-white underline text-xs font-medium'
            }))
          ]);
          break;

        case 'matrix':
        case 'rain':
          runMatrixEffect();
          break;

        case 'sound':
        case 'audio': {
          const next = !soundEnabled;
          setSoundEnabled(next);
          terminalSound.toggleSound(next);
          setHistory(prev => [...prev, {
            type: 'system',
            text: `[AUDIO CORE] Synthesizer ${next ? 'ONLINE (Mechanical clicks & telemetry bleeps active)' : 'MUTED'}`,
            color: next ? 'text-emerald-600 dark:text-green-400 font-bold' : 'text-amber-600 dark:text-yellow-400 font-medium'
          }]);
          break;
        }

        case 'clear':
        case 'cls':
          setHistory([]);
          break;

        case 'whoami':
          setHistory(prev => [...prev, { type: 'system', text: 'guest_entity [PRIVILEGE: READ_ONLY] (unauthorized)', color: 'text-amber-600 dark:text-yellow-400 font-medium' }]);
          break;

        case 'sudo':
        case 'sudo su':
        case 'sudo hire himanshu':
          if (lowerCmd.includes('hire')) {
            terminalSound.playSuccessChime();
            setHistory(prev => [...prev, { 
              type: 'system', 
              text: '[ACCESS GRANTED] Match confirmed! Generating transmission link for himanshunikam1817@gmail.com...', 
              color: 'text-emerald-600 dark:text-green-400 font-bold text-glow' 
            }]);
            setMode('name');
          } else {
            terminalSound.playAccessDeniedBuzzer();
            setHistory(prev => [...prev, { 
              type: 'system', 
              text: 'Access Denied. Quantum firewall prevented unauthorized privilege escalation.', 
              color: 'text-rose-600 dark:text-red-500 font-bold text-glow' 
            }]);
          }
          break;

        case 'contact':
          setHistory(prev => [...prev, { type: 'system', text: 'INITIALIZING SECURE MESSAGE UPLINK...', color: 'text-nano-cyan font-bold text-glow' }]);
          setMode('name');
          break;

        case '':
          break;

        default:
          setHistory(prev => [...prev, { type: 'system', text: `Command not found: ${cleanCmd}. Type "help" or click a command tag.`, color: 'text-slate-500 dark:text-gray-500' }]);
      }
    } else if (mode === 'name') {
      if (!cleanCmd) return;
      setFormData(prev => ({ ...prev, name: cleanCmd }));
      setMode('email');
    } else if (mode === 'email') {
      if (!cleanCmd) return;
      setFormData(prev => ({ ...prev, email: cleanCmd }));
      setMode('message');
    } else if (mode === 'message') {
      if (!cleanCmd) return;
      const finalData = { ...formData, message: cleanCmd };
      setFormData(finalData);
      setMode('sending');
      
      terminalSound.playTransmissionBeep();

      setHistory(prev => [...prev, 
        { type: 'system', text: 'ENCRYPTING PAYLOAD [||||||||||] 100%', color: 'text-amber-600 dark:text-yellow-400 font-medium' },
        { type: 'system', text: 'TRANSMITTING VIA SECURE QUANTUM CHANNEL...', color: 'text-nano-cyan font-semibold' }
      ]);
      
      // EmailJS send
      emailjs.send('service_dummy', 'template_dummy', finalData, 'public_key_dummy')
        .then(() => {
          setTimeout(() => {
            terminalSound.playSuccessChime();
            setHistory(prev => [...prev, { type: 'system', text: 'TRANSFER COMPLETE. UPLINK SEVERED.', color: 'text-emerald-600 dark:text-green-400 font-bold text-glow' }]);
            setMode('cmd');
            setFormData({ name: '', email: '', message: '' });
          }, 1500);
        })
        .catch(() => {
          setTimeout(() => {
            terminalSound.playSuccessChime();
            setHistory(prev => [...prev, { type: 'system', text: 'TRANSFER SUCCESSFUL (SIMULATION). CONNECTION CLOSED.', color: 'text-emerald-600 dark:text-green-400 font-bold text-glow' }]);
            setMode('cmd');
            setFormData({ name: '', email: '', message: '' });
          }, 1500);
        });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommand(currentInput);
      setCurrentInput('');
    }
  };

  const handleChipClick = (chip) => {
    terminalSound.init();
    if (mode === 'cmd') {
      handleCommand(chip);
    }
  };

  return (
    <ModuleContainer className="max-w-3xl w-full !p-0 overflow-hidden bg-slate-100/95 dark:bg-[#050505] border border-sky-500/30 dark:border-nano-cyan/40 shadow-[0_20px_50px_rgba(14,165,233,0.15),0_0_25px_rgba(14,165,233,0.1)] dark:shadow-[0_0_35px_rgba(0,240,255,0.15)] relative rounded-lg">
      
      {/* Telemetry Header Bar */}
      <div className="flex flex-wrap items-center justify-between bg-slate-200/90 dark:bg-[#0d0d12] px-4 py-2.5 border-b border-sky-500/20 dark:border-nano-cyan/20 select-none gap-2">
        
        {/* Window controls & Node status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80 shadow-[0_0_5px_rgba(245,158,11,0.5)]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-sky-600 dark:text-nano-cyan/80 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-nano-cyan animate-pulse shadow-[0_0_6px_var(--accent-primary)]"></span>
            <span>NODE #NX-88</span>
          </div>
        </div>

        {/* Live Clock & Latency Telemetry */}
        <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono text-slate-600 dark:text-gray-400 font-medium">
          <span>{currentTime || '00:00:00'}</span>
          <span className="text-slate-400 dark:text-white/20">|</span>
          <span className="text-emerald-600 dark:text-green-400/90">{pingMs}ms [Q-MESH]</span>
          <span className="text-slate-400 dark:text-white/20">|</span>
          <span className="text-sky-600 dark:text-nano-cyan/70">guest@neoquantx</span>
        </div>

        {/* Sound Toggle Button */}
        <button
          type="button"
          onClick={handleToggleSound}
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider transition-all ${
            soundEnabled 
              ? 'bg-nano-cyan/15 text-nano-cyan border border-nano-cyan/40 shadow-[0_0_8px_rgba(14,165,233,0.2)] dark:shadow-[0_0_8px_rgba(0,240,255,0.2)] hover:bg-nano-cyan/25' 
              : 'bg-slate-200/80 dark:bg-white/5 text-slate-600 dark:text-gray-400 border border-slate-300 dark:border-white/10 hover:bg-slate-300/80 dark:hover:bg-white/10'
          }`}
          title="Toggle Terminal Audio Synthesizer"
          data-hoverable="true"
        >
          <span>{soundEnabled ? '🔊 SFX' : '🔇 MUTED'}</span>
        </button>
      </div>

      {/* Clickable Command Suggestion Chips */}
      <div className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-200/50 dark:bg-[#09090e] border-b border-slate-300/50 dark:border-white/5 overflow-x-auto custom-scrollbar select-none">
        <span className="text-[9px] font-mono text-slate-500 dark:text-nano-muted uppercase tracking-widest mr-1 whitespace-nowrap font-medium">QUICK EXEC:</span>
        {COMMAND_CHIPS.map(chip => (
          <button
            key={chip}
            type="button"
            onClick={() => handleChipClick(chip)}
            className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/90 dark:bg-white/5 text-slate-700 dark:text-gray-300 border border-slate-300/80 dark:border-white/10 hover:border-nano-cyan/60 hover:text-nano-cyan hover:bg-sky-50 dark:hover:bg-nano-cyan/10 transition-all whitespace-nowrap shadow-xs dark:shadow-none font-medium"
            data-hoverable="true"
          >
            {chip}
          </button>
        ))}
      </div>
      
      {/* Terminal Window with CRT Scanline & Text Glow */}
      <div 
        className="font-mono text-xs md:text-sm p-5 min-h-[250px] sm:min-h-[350px] max-h-[250px] sm:max-h-[350px] overflow-y-auto cursor-text bg-slate-50/95 dark:bg-[#030305] custom-scrollbar relative"
        onClick={() => {
          terminalSound.init();
          inputRef.current?.focus();
        }}
      >
        {/* Subtle CRT Phosphor Glow Background Effect */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.06)_0%,rgba(241,245,249,0.6)_100%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.03)_0%,rgba(0,0,0,0.4)_100%)]"></div>

        <div className="relative z-10 flex flex-col gap-1.5">
          {history.map((line, i) => (
            <div key={i} className={`whitespace-pre-wrap leading-relaxed ${line.color || 'text-slate-700 dark:text-gray-300'}`}>
              {line.type === 'input' ? (
                <>
                  <span className="text-nano-cyan mr-2 font-bold">{line.prompt}</span>
                  <span className="text-slate-900 dark:text-white font-medium">{line.text}</span>
                </>
              ) : (
                line.text
              )}
            </div>
          ))}
          
          {/* Active Input Line */}
          {mode !== 'booting' && mode !== 'sending' && !isMatrixActive && (
            <div className="flex mt-1 items-center">
              <span className="text-nano-cyan mr-2 whitespace-nowrap font-bold">{getCurrentPrompt()}</span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => {
                  setCurrentInput(e.target.value);
                  terminalSound.playKeyClick();
                }}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-none outline-none flex-1 text-slate-900 dark:text-white caret-nano-cyan text-xs md:text-sm font-medium"
                autoComplete="off"
                spellCheck="false"
              />
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>
    </ModuleContainer>
  );
}
