import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { terminalSound } from '../../utils/terminalSound';

const SoundToggle = () => {
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = (e) => {
    e.stopPropagation();
    terminalSound.init();
    const nextState = !isAudioActive;
    setIsAudioActive(nextState);
    terminalSound.toggleSound(nextState);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Mini HUD Info Tag on Hover */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex flex-col items-end px-3 py-1.5 rounded bg-slate-900/85 dark:bg-black/85 backdrop-blur-md border border-nano-cyan/40 text-[9px] font-mono tracking-widest text-nano-cyan shadow-[0_0_15px_rgba(0,240,255,0.15)] pointer-events-none"
        >
          <span className="font-bold">{isAudioActive ? 'SYNTH ENGINE: ONLINE' : 'AUDIO: MUTED'}</span>
          <span className="text-[7px] text-text-secondary">SPACE DRONE & SFX</span>
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggle}
        onMouseEnter={() => {
          setIsHovered(true);
          terminalSound.playHoverTick();
        }}
        onMouseLeave={() => setIsHovered(false)}
        className={`p-3.5 rounded-xl module-glass border transition-all duration-300 shadow-2xl flex items-center justify-center relative overflow-hidden group ${
          isAudioActive 
            ? 'border-nano-cyan/60 shadow-[0_0_20px_rgba(0,240,255,0.3)] text-nano-cyan' 
            : 'border-white/10 text-text-secondary hover:border-white/30'
        }`}
        aria-label="Toggle Sound and Ambient Cyber Drone"
        data-hoverable="true"
      >
        {/* Active Animated Audio Bars Indicator */}
        {isAudioActive && (
          <div className="absolute inset-0 bg-nano-cyan/5 pointer-events-none" />
        )}

        <div className="flex items-center gap-1.5">
          {/* Animated sound bars */}
          <div className="flex items-end gap-[2.5px] h-4">
            <span className={`w-[2.5px] rounded-full bg-current transition-all duration-300 ${isAudioActive ? 'h-3.5 animate-pulse' : 'h-1.5 opacity-40'}`} />
            <span className={`w-[2.5px] rounded-full bg-current transition-all duration-300 ${isAudioActive ? 'h-5 animate-pulse delay-75' : 'h-2.5 opacity-40'}`} />
            <span className={`w-[2.5px] rounded-full bg-current transition-all duration-300 ${isAudioActive ? 'h-2.5 animate-pulse delay-150' : 'h-1 opacity-40'}`} />
            <span className={`w-[2.5px] rounded-full bg-current transition-all duration-300 ${isAudioActive ? 'h-4 animate-pulse delay-100' : 'h-2 opacity-40'}`} />
          </div>

          <span className="text-[10px] font-mono font-bold tracking-widest ml-1 hidden sm:inline">
            {isAudioActive ? 'AUDIO' : 'MUTE'}
          </span>
        </div>

        {/* Corner Brackets */}
        <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-nano-cyan opacity-40 group-hover:opacity-100" />
        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-nano-cyan opacity-40 group-hover:opacity-100" />
      </motion.button>
    </div>
  );
};

export default SoundToggle;
