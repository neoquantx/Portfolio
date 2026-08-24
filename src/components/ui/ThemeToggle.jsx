import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-lg module-glass hover:scale-105 transition-transform"
      aria-label="Toggle Theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative flex items-center justify-center"
      >
        {isDark ? (
          <Moon className="w-5 h-5 text-nano-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
        ) : (
          <Sun className="w-5 h-5 text-nano-cyan drop-shadow-[0_0_8px_rgba(2,132,199,0.5)]" />
        )}
      </motion.div>
      
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-nano-cyan opacity-50" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-nano-cyan opacity-50" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-nano-cyan opacity-50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-nano-cyan opacity-50" />
    </motion.button>
  );
}
