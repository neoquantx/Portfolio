import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, ExternalLink } from 'lucide-react';

export default function ProjectSlide({ project, isActive, onClose }) {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-8 bg-black/60 backdrop-blur-md pointer-events-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-6xl max-h-[92dvh] overflow-y-auto bg-black/40 backdrop-blur-2xl border border-white/[0.08] rounded-2xl sm:rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-20 p-3 text-white/50 hover:text-white transition-all rounded-full bg-black/20 hover:bg-white/10 border border-white/[0.05] hover:border-white/20 backdrop-blur-xl"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col lg:flex-row min-h-[420px] sm:min-h-[520px] lg:min-h-[600px]">
              {/* Left Side: Content */}
              <div className="flex-1 p-4 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center relative z-10 order-2 lg:order-1">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="mb-4 font-mono text-xs text-[#00f0ff] tracking-[0.3em] uppercase">
                    {project.category || "Featured Project"}
                  </div>
                  
                  <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 tracking-tight">
                    {project.title}
                  </h2>
                  
                  <p className="text-[#94a3b8] font-body text-lg md:text-xl mb-10 leading-relaxed font-light">
                    {project.description}
                  </p>

                  <div className="mb-12">
                    <h3 className="font-mono text-xs text-[#64748b] mb-4 tracking-[0.2em] uppercase">
                      Tech Stack Formula
                    </h3>
                    <div className="flex flex-wrap gap-3 font-mono text-sm">
                      {project.techStack?.map((tech, i) => (
                        <span 
                          key={i} 
                          className="px-4 py-1.5 bg-white/[0.03] text-white/70 border border-white/[0.08] rounded-full hover:bg-white/[0.08] hover:text-white transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-5">
                    {project.live && (
                      <a 
                        href={project.live} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="group flex items-center gap-3 px-8 py-4 bg-white text-black hover:bg-white/90 rounded-full font-mono text-sm font-medium transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                      >
                        Launch Project <ExternalLink size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    )}
                    {project.github && (
                      <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="group flex items-center gap-3 px-8 py-4 bg-black/50 hover:bg-white/10 border border-white/[0.1] hover:border-white/[0.2] rounded-full font-mono text-sm text-white transition-all"
                      >
                        <Github size={16} /> Source Code
                      </a>
                    )}
                  </div>
                </motion.div>
              </div>
              
              {/* Right Side: Image/Visual */}
              {project.image && (
                <div className="flex-1 relative lg:border-l border-white/[0.08] min-h-[300px] lg:min-h-full overflow-hidden order-1 lg:order-2">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent lg:bg-gradient-to-l z-10 pointer-events-none" />
                  
                  {/* Subtle color overlay */}
                  <div className="absolute inset-0 bg-[#00f0ff]/10 mix-blend-overlay z-10 pointer-events-none" />
                  
                  <motion.img 
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    src={project.image} 
                    alt={project.title} 
                    className="absolute inset-0 w-full h-full object-cover filter grayscale-[30%] hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100" 
                  />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
