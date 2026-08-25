import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SoundToggle = () => {
  const [isMuted, setIsMuted] = useState(false);

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setIsMuted(!isMuted)}
      className="fixed bottom-8 right-8 z-40 p-4 rounded-full bg-nano-void/40 backdrop-blur-md border border-white/10 text-nano-text hover:bg-white/10 hover:border-white/20 transition-colors shadow-2xl flex items-center justify-center w-14 h-14"
      aria-label="Toggle Sound"
      data-hoverable="true"
    >
      <svg 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        {isMuted ? (
          <>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </>
        ) : (
          <>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </>
        )}
      </svg>
    </motion.button>
  );
};

export default SoundToggle;
