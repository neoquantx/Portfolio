import React from 'react';
import { motion } from 'framer-motion';

const DataLabel = ({ title, value, label, position = 'left' }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: position === 'left' ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute ${position === 'left' ? 'right-full mr-8' : 'left-full ml-8'} top-1/2 -translate-y-1/2 flex items-center z-10 pointer-events-none`}
    >
      {/* Connecting Line */}
      <div className={`h-[1px] w-12 bg-white/20 ${position === 'left' ? 'order-last ml-2' : 'order-first mr-2'}`} />
      
      {/* Label Box */}
      <div className="p-4 bg-nano-void/60 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl min-w-[140px]">
        <div className="text-[10px] uppercase tracking-[0.2em] text-nano-muted mb-1 font-mono">
          {label}
        </div>
        <div className="text-xs font-bold text-nano-text tracking-wide mb-1 font-sans">
          {title}
        </div>
        <div className="text-sm text-nano-glow font-mono">
          {value}
        </div>
      </div>
    </motion.div>
  );
};

export default DataLabel;
