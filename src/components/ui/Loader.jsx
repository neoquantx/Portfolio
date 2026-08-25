import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Loader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 12;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => setIsComplete(true), 600);
      }
      setProgress(Math.min(current, 100));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-primary"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.05,
            filter: "blur(20px)",
            transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
          }}
        >
          <div className="w-64 flex flex-col items-start gap-4">
            <div className="flex justify-between w-full font-mono text-xs text-text-secondary tracking-widest uppercase">
              <span>System Initialization</span>
              <span>{Math.round(progress).toString().padStart(3, '0')}%</span>
            </div>
            
            <div className="w-full h-[1px] bg-slate-300 dark:bg-white/10 relative overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 bottom-0 bg-nano-cyan shadow-[0_0_10px_var(--color-nano-cyan)]"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.2 }}
              />
            </div>
            
            <div className="font-mono text-[10px] text-text-secondary opacity-70 tracking-wider h-4">
              {progress < 25 && "Booting sequence..."}
              {progress >= 25 && progress < 60 && "Establishing neural link..."}
              {progress >= 60 && progress < 95 && "Compiling shaders..."}
              {progress >= 95 && "System online."}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
