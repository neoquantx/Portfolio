import React from 'react';
import { motion } from 'framer-motion';

export default function ModuleContainer({ 
  children, 
  className = "", 
  delay = 0,
  ...props 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`relative module-glass p-8 md:p-12 overflow-hidden group ${className}`}
      {...props}
    >
      {/* Corner Brackets - Using CSS variables from theme */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-nano-cyan pointer-events-none transition-all duration-300 group-hover:w-6 group-hover:h-6 group-hover:border-nano-purple" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-nano-cyan pointer-events-none transition-all duration-300 group-hover:w-6 group-hover:h-6 group-hover:border-nano-purple" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-nano-cyan pointer-events-none transition-all duration-300 group-hover:w-6 group-hover:h-6 group-hover:border-nano-purple" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-nano-cyan pointer-events-none transition-all duration-300 group-hover:w-6 group-hover:h-6 group-hover:border-nano-purple" />
      
      {/* Scan line effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nano-cyan/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:-translate-y-full group-hover:animate-[scan_2s_ease-in-out_infinite] pointer-events-none" />

      <div className="relative z-10 pointer-events-auto">
        {children}
      </div>
    </motion.div>
  );
}
