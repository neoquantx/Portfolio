import React from 'react';
import { motion } from 'framer-motion';

const ScrollPrompt = () => {
  return (
    <motion.div 
      className="absolute bottom-2 sm:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-70 z-10 scale-90 sm:scale-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3, duration: 2, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--nano-muted)] mb-4 font-mono">Scroll</span>
      <div className="w-[1px] h-16 bg-[var(--nano-void)] overflow-hidden relative">
        <div className="absolute inset-0 bg-white/20" />
        <motion.div 
          className="w-full h-1/3 bg-[var(--nano-glow)] shadow-[0_0_10px_var(--nano-glow)]"
          animate={{
            y: ['-100%', '300%'],
          }}
          transition={{
            duration: 2.5,
            ease: [0.16, 1, 0.3, 1],
            repeat: Infinity,
          }}
        />
      </div>
    </motion.div>
  );
};

export default ScrollPrompt;
