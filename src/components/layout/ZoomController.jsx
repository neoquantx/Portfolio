import React, { useState, useMemo } from 'react';
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
          <motion.div key="l3" {...slideVariants} className="w-full max-w-7xl mx-auto flex flex-col items-center pointer-events-auto h-full max-h-[calc(100vh-6rem)]">
            <ModuleContainer className="w-full mb-6 text-center !p-4 md:!p-6">
              <h2 className="text-sm font-mono text-nano-purple tracking-widest mb-2">[ ARCHIVE_DATA ]</h2>
              <h3 className="text-2xl md:text-3xl font-space font-bold mb-2 text-text-primary">Deployments</h3>
              <p className="text-text-secondary font-mono text-xs md:text-sm">Accessing mission-critical project modules</p>
            </ModuleContainer>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-y-auto custom-scrollbar pb-10 px-1">
              {portfolioData.projects.map((proj, idx) => (
                <ModuleContainer 
                  key={idx} 
                  delay={0.1 + idx * 0.15} 
                  className="flex flex-col h-full group hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300 relative overflow-hidden"
                >
                  {/* Hover Scanline */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-nano-purple/5 to-transparent -translate-y-full group-hover:animate-scanline pointer-events-none" />
                  
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-nano-purple bg-nano-purple/10 p-2 rounded border border-nano-purple/30">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                    </div>
                    <a href={proj.github} target="_blank" rel="noreferrer" className="text-text-secondary hover:text-nano-cyan transition-colors" title="View Source">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                    </a>
                  </div>

                  {/* Content */}
                  <h4 className="text-lg md:text-xl font-bold font-space text-text-primary mb-3 group-hover:text-nano-purple transition-colors">{proj.title}</h4>
                  <p className="text-xs md:text-sm text-text-secondary mb-6 flex-grow">{proj.description}</p>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-white/5">
                    {proj.techStack.map(t => (
                      <span key={t} className="text-[9px] font-mono border border-nano-purple/30 bg-nano-purple/5 px-1.5 py-0.5 rounded text-nano-purple/90 whitespace-nowrap">
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
          <motion.div key="l4" {...slideVariants} className="w-full max-w-7xl mx-auto flex items-start justify-center pointer-events-auto max-h-[calc(100vh-3rem)] md:max-h-[calc(100vh-6rem)] lg:max-h-[calc(100vh-12rem)]">
            <div className="flex flex-col items-center justify-start text-center w-full">
              <ModuleContainer className="max-w-5xl w-full !p-4 md:!p-6 lg:!p-8">
                {/* Header */}
                <h2 className="text-xs md:text-sm font-mono text-nano-orange tracking-widest mb-1">[ CAPABILITY_MATRIX ]</h2>
                <p className="text-text-secondary text-[10px] md:text-xs font-mono mb-3 md:mb-4">FRONTEND · BACKEND · ML/AI · MOBILE · CLOUD · SYSTEMS</p>

                {/* Stats Row */}
                <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-4 md:mb-6">
                  {[
                    { label: 'TECHNOLOGIES', value: portfolioData.skills.length },
                    { label: 'DOMAINS', value: [...new Set(portfolioData.skills.map(s => s.category))].length },
                    { label: 'HACKATHONS', value: portfolioData.hackathons?.length || 5 },
                    { label: 'PROJECTS', value: portfolioData.projects.length },
                  ].map((stat, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <span className="text-xl md:text-2xl lg:text-3xl font-space font-bold text-nano-cyan text-glow">{stat.value}</span>
                      <span className="text-[8px] md:text-[9px] font-mono text-text-secondary tracking-widest">{stat.label}</span>
                    </div>
                  ))}
                </div>

                {/* Scrollable Category Groups */}
                <div className="space-y-3 md:space-y-4 text-left max-h-[50vh] md:max-h-[55vh] overflow-y-auto pr-1 custom-scrollbar">
                  {(() => {
                    const categories = [...new Set(portfolioData.skills.map(s => s.category))];
                    const categoryIcons = {
                      'Frontend': '⚡',
                      'Backend': '🔧',
                      'ML & AI': '🧠',
                      'Mobile': '📱',
                      'Cloud & DB': '☁️',
                      'DevOps': '🚀',
                      'Core': '⚙️'
                    };
                    const categoryColors = {
                      'Frontend': 'border-nano-cyan/40',
                      'Backend': 'border-emerald-500/40',
                      'ML & AI': 'border-nano-purple/40',
                      'Mobile': 'border-nano-orange/40',
                      'Cloud & DB': 'border-teal-500/40',
                      'DevOps': 'border-amber-500/40',
                      'Core': 'border-sky-500/40'
                    };
                    const categoryAccents = {
                      'Frontend': 'text-nano-cyan',
                      'Backend': 'text-emerald-400 dark:text-emerald-400',
                      'ML & AI': 'text-nano-purple',
                      'Mobile': 'text-nano-orange',
                      'Cloud & DB': 'text-teal-400 dark:text-teal-400',
                      'DevOps': 'text-amber-500 dark:text-amber-400',
                      'Core': 'text-sky-500 dark:text-sky-400'
                    };
                    return categories.map((cat, ci) => {
                      const catSkills = portfolioData.skills.filter(s => s.category === cat);
                      return (
                        <div key={ci}>
                          {/* Category Header */}
                          <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                            <span className="text-sm md:text-base">{categoryIcons[cat] || '▸'}</span>
                            <span className={`text-[10px] md:text-xs font-mono tracking-widest font-bold uppercase ${categoryAccents[cat] || 'text-nano-cyan'}`}>
                              {cat}
                            </span>
                            <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent dark:from-white/10"></div>
                            <span className="text-[8px] md:text-[9px] font-mono text-text-secondary">{catSkills.length} MODULES</span>
                          </div>
                          {/* Skills Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                            {catSkills.map((skill, si) => {
                              // Generate a pseudo-random hex id for HUD aesthetics
                              const hexId = `0x${(skill.name.length * 13).toString(16).padStart(2, '0')}${(skill.level * 7).toString(16).slice(-2)}`;
                              return (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: 0.1 + (ci * 0.1) + (si * 0.05) }}
                                  key={si}
                                  className={`group relative flex flex-col border-l-2 ${categoryColors[cat] || 'border-nano-cyan/30'} pl-2 md:pl-3 py-1.5 md:py-2 bg-white/[0.01] dark:bg-black/20 rounded-r-sm hover:bg-white/[0.05] dark:hover:bg-white/[0.05] transition-all duration-300 hover:shadow-[inset_0_0_15px_rgba(0,240,255,0.05)] cursor-default overflow-hidden`}
                                >
                                  {/* Decorative scanline hover effect */}
                                  <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-white/5 to-transparent -translate-y-full group-hover:animate-scanline pointer-events-none" />
                                  
                                  <div className="flex justify-between items-start w-full">
                                    <span className="font-space text-xs md:text-sm font-bold text-text-primary leading-tight relative z-10 group-hover:text-glow transition-all">{skill.name}</span>
                                    <span className="text-[6px] md:text-[8px] font-mono text-text-secondary/50 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-2">{hexId}</span>
                                  </div>
                                  
                                  <div className="flex items-center gap-1.5 md:gap-2 mt-1 md:mt-1.5 relative z-10">
                                    <div className="flex-1 h-1 md:h-1.5 bg-black/20 dark:bg-white/5 rounded-full overflow-hidden relative">
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${skill.level}%` }}
                                        transition={{ duration: 1, delay: 0.3 + (ci * 0.1) + (si * 0.05), ease: "easeOut" }}
                                        className={`h-full rounded-full ${
                                          skill.level >= 80 ? 'bg-nano-cyan shadow-[0_0_8px_var(--color-nano-cyan)]' :
                                          skill.level >= 60 ? 'bg-nano-purple shadow-[0_0_8px_var(--color-nano-purple)]' :
                                          'bg-nano-orange shadow-[0_0_8px_var(--color-nano-orange)]'
                                        }`}
                                      />
                                    </div>
                                    <span className="text-[9px] md:text-[10px] font-mono font-bold text-text-secondary">{skill.level}%</span>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    });
                  })()}
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
