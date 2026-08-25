import React from 'react';
import { motion } from 'framer-motion';

const HelixTooltip = ({ title, description, stats }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 5, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="p-5 bg-nano-void/80 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl min-w-[220px] pointer-events-none z-50"
    >
      <div className="mb-3 border-b border-white/10 pb-2">
        <h4 className="text-sm font-semibold text-nano-text font-sans tracking-wide">{title}</h4>
      </div>
      <p className="text-xs text-nano-muted font-sans leading-relaxed mb-4">
        {description}
      </p>
      
      {stats && (
        <div className="grid grid-cols-2 gap-3 mt-2">
          {Object.entries(stats).map(([key, val]) => (
            <div key={key} className="flex flex-col">
              <span className="text-[9px] uppercase tracking-[0.15em] text-nano-muted font-mono">{key}</span>
              <span className="text-xs text-nano-helix font-mono mt-0.5">{val}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default HelixTooltip;
