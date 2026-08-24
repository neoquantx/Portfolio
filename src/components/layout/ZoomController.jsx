import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ModuleContainer from '../ui/ModuleContainer';
import ProjectSlide from '../ui/ProjectSlide';
import ContactTerminal from '../ui/ContactTerminal';

export default function ZoomController({ scrollProgress, portfolioData }) {
  // Determine level (1-5)
  const getZoomLevel = (p) => {
    if (p <= 0.2) return 1;
    if (p <= 0.4) return 2;
    if (p <= 0.6) return 3;
    if (p <= 0.8) return 4;
    return 5;
  };
  
  const level = getZoomLevel(scrollProgress);

  const slideVariants = {
    initial: { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, scale: 1.05, filter: 'blur(10px)', transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="w-full h-full p-6 md:p-12 lg:p-24 flex items-center justify-center pointer-events-none">
      
      {/* HUD Navigation Indicator */}
      <div className="absolute top-12 left-12 flex flex-col gap-2 pointer-events-none">
        {[1, 2, 3, 4, 5].map((l) => (
          <div key={l} className="flex items-center gap-3">
            <div className={`w-1 h-8 transition-colors duration-500 ${level === l ? 'bg-nano-cyan shadow-[0_0_10px_#00f0ff]' : 'bg-white/10'}`} />
            <span className={`text-[10px] tracking-[0.2em] font-mono transition-opacity duration-500 ${level === l ? 'text-nano-cyan opacity-100' : 'text-white/30 opacity-0'}`}>
              Lvl 0{l}
            </span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* LEVEL 1: SURFACE */}
        {level === 1 && (
          <motion.div key="l1" {...slideVariants} className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center pointer-events-auto">
            <ModuleContainer className="text-center px-16 py-12">
              <h1 className="text-6xl md:text-8xl font-space font-bold tracking-tighter mb-4 text-glow text-text-primary">
                {portfolioData.personal.name}
              </h1>
              <p className="font-mono tracking-[0.3em] text-nano-cyan uppercase text-sm md:text-base">
                {portfolioData.personal.title}
              </p>
            </ModuleContainer>
          </motion.div>
        )}

        {/* LEVEL 2: LATTICE / BIO */}
        {level === 2 && (
          <motion.div key="l2" {...slideVariants} className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 pointer-events-auto">
            <div className="md:col-span-5 md:col-start-8 flex flex-col justify-center">
              <ModuleContainer delay={0.2}>
                <h2 className="text-sm font-mono text-nano-cyan tracking-widest mb-4">[ IDENTITY_MATRIX ]</h2>
                <h3 className="text-3xl font-space font-bold mb-6 text-text-primary">Systems Online.</h3>
                <p className="text-text-secondary leading-relaxed font-space">
                  {portfolioData.personal.bio}
                </p>
              </ModuleContainer>
            </div>
          </motion.div>
        )}

        {/* LEVEL 3: LAB / PROJECTS */}
        {level === 3 && (
          <motion.div key="l3" {...slideVariants} className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 pointer-events-auto">
            <div className="md:col-span-4 flex flex-col justify-center">
              <ModuleContainer>
                <h2 className="text-sm font-mono text-nano-purple tracking-widest mb-4">[ ARCHIVE_DATA ]</h2>
                <h3 className="text-4xl font-space font-bold mb-4 text-text-primary">Deployments</h3>
                <p className="text-text-secondary font-space">Accessing mission-critical project modules.</p>
              </ModuleContainer>
            </div>
            {/* The actual projects could be rendered here, but we will just show a summary card since the hex grid was doing it before */}
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {portfolioData.projects.slice(0, 2).map((proj, idx) => (
                <ModuleContainer key={idx} delay={0.3 + idx * 0.1}>
                  <h4 className="text-xl font-bold font-space text-nano-cyan mb-2">{proj.title}</h4>
                  <p className="text-sm text-text-secondary mb-4 line-clamp-3">{proj.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {proj.techStack.slice(0, 3).map(t => (
                      <span key={t} className="text-[10px] font-mono border border-nano-cyan/30 px-2 py-1 rounded text-nano-cyan">
                        {t}
                      </span>
                    ))}
                  </div>
                </ModuleContainer>
              ))}
            </div>
          </motion.div>
        )}

        {/* LEVEL 4: DNA / SKILLS */}
        {level === 4 && (
          <motion.div key="l4" {...slideVariants} className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 pointer-events-auto">
            <div className="md:col-span-12 flex flex-col items-center justify-center text-center">
              <ModuleContainer className="max-w-3xl w-full">
                <h2 className="text-sm font-mono text-nano-orange tracking-widest mb-4">[ CAPABILITY_MATRIX ]</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 text-left">
                  {portfolioData.skills.slice(0, 8).map((skill, i) => (
                    <div key={i} className="flex flex-col border-l border-nano-cyan/30 pl-3">
                      <span className="font-mono text-[10px] text-text-secondary">{skill.category}</span>
                      <span className="font-space text-sm font-bold text-text-primary">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </ModuleContainer>
            </div>
          </motion.div>
        )}

        {/* LEVEL 5: CORE / CONTACT */}
        {level === 5 && (
          <motion.div key="l5" {...slideVariants} className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center pointer-events-auto">
            <ContactTerminal data={portfolioData.socials} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
