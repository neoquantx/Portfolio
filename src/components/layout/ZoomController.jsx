import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Mail, Github, Home, Trophy, Rocket, Cpu } from 'lucide-react';
import FloatingNavigation from '../shitui/FloatingNavigation';
import ModuleContainer from '../ui/ModuleContainer';
import ProjectSlide from '../ui/ProjectSlide';
import ContactTerminal from '../ui/ContactTerminal';
const ProjectSimulatorModal = React.lazy(() => import('../ui/ProjectSimulatorModal'));
import TrophyRingSection from '../ui/TrophyRingSection';
import { terminalSound } from '../../utils/terminalSound';
import { useActiveSection, scrollToLevel } from '../../hooks/useScrollProgress';
import ScrollPrompt from '../ui/ScrollPrompt';
import { MagneticScatterText } from '../shitui/MagneticScatterText';
import LiquidButton from '../shitui/LiquidButton';

export default function ZoomController({ portfolioData, isOverclocked, setIsOverclocked }) {
  const { active, sectionRef } = useActiveSection(5);
  const [selectedSimulatorProject, setSelectedSimulatorProject] = useState(null);
  const [selectedSkillCategory, setSelectedSkillCategory] = useState('ALL');
  const [selectedActiveSkill, setSelectedActiveSkill] = useState(null);

  const githubUrl = portfolioData.socials.find((s) => s.name === 'GitHub')?.url || 'https://github.com/neoquantx';

  // Magnetic hero words react to the cursor — static text when the user
  // prefers reduced motion. Touch devices are handled by disableOnMobile.
  const allowMagnet = useMemo(() => {
    try {
      return !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    } catch { return true; }
  }, []);

  // Floating dock destinations — one icon per portfolio section.
  const NAV_ITEMS = [
    { id: 'surface', label: 'Surface', icon: <Home className="h-5 w-5" /> },
    { id: 'deployments', label: 'Deployments', icon: <Rocket className="h-5 w-5" /> },
    { id: 'skills', label: 'Skills', icon: <Cpu className="h-5 w-5" /> },
    { id: 'trophies', label: 'Mission Logs', icon: <Trophy className="h-5 w-5" /> },
    { id: 'contact', label: 'Contact', icon: <Mail className="h-5 w-5" /> },
  ];
  const handleDockSelect = (id) => {
    const idx = NAV_ITEMS.findIndex((n) => n.id === id);
    if (idx >= 0) scrollToLevel(idx + 1);
  };

  // Link skills to matching projects
  const getLinkedProjects = (skillName) => {
    if (!skillName || !portfolioData?.projects) return [];
    const normalized = skillName.toLowerCase();
    return portfolioData.projects.filter(p => {
      return p.techStack.some(t => {
        const tn = t.toLowerCase();
        return tn.includes(normalized) || normalized.includes(tn) ||
          (normalized.includes('html') && tn.includes('html')) ||
          (normalized.includes('css') && tn.includes('css')) ||
          (normalized.includes('dsa') && tn.includes('algo'));
      });
    });
  };

  // Active section (1-5) comes from the section observer. The page scrolls
  // natively — no fake scroll height, no hysteresis, no scroll fighting.
  const level = active;

  // Sections stay mounted and animate once when scrolled into view — no
  // remounts, no exit flashes, nothing fighting the scrollbar.
  const sectionVariants = {
    initial: { opacity: 0, y: 24 },
    whileInView: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
    }
  };
  const sectionViewport = { once: true, margin: '-12% 0px' };

  return (
    <div className={`relative w-full ${isOverclocked ? 'animate-glitch' : ''}`}>
      
      {/* Floating dock navigation (ShitUI) — top-center on all screens, clear
          of the theme toggle and the terminal button. Active icon follows the
          section in view; tapping one travels there. */}
      <FloatingNavigation
        items={NAV_ITEMS}
        activeId={NAV_ITEMS[Math.min(4, Math.max(0, level - 1))].id}
        onSelect={handleDockSelect}
        className="bottom-auto top-2 sm:top-4"
      />


      {/* LEVEL 1: SURFACE */}
      <motion.section data-level="1" ref={sectionRef(0)} {...sectionVariants} viewport={sectionViewport} className="relative w-full max-w-7xl mx-auto px-3 sm:px-6 md:px-12 lg:px-24 min-h-svh flex flex-col items-center justify-center py-16">
            <ModuleContainer className="text-center px-4 sm:px-10 md:px-16 py-6 sm:py-10 md:py-12">
              {allowMagnet ? (
                <MagneticScatterText
                  text={portfolioData.personal.name}
                  className="font-space font-bold tracking-tighter leading-none text-glow text-3xl sm:text-5xl md:text-7xl lg:text-8xl mb-3 sm:mb-4"
                  letterClassName="inline-block text-text-primary"
                />
              ) : (
                <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-space font-bold tracking-tighter mb-3 sm:mb-4 text-glow text-text-primary break-words leading-none">
                  {portfolioData.personal.name}
                </h1>
              )}
              <p className="font-mono tracking-[0.2em] sm:tracking-[0.3em] text-nano-cyan uppercase text-xs sm:text-sm md:text-base">
                {portfolioData.personal.title}
              </p>
              <p className="mt-4 text-text-secondary text-xs sm:text-sm font-space max-w-md mx-auto leading-relaxed">
                {portfolioData.personal.tagline}
              </p>
              <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                <LiquidButton
                  onClick={() => { window.location.href = `mailto:${portfolioData.personal.email}`; }}
                  backgroundColor="bg-sky-600 dark:bg-cyan-400"
                  textColor="text-white dark:text-slate-950"
                  className="p-1"
                  data-hoverable="true"
                  aria-label="Email me"
                >
                  <Mail className="w-4 h-4" /> Email Me
                </LiquidButton>
                <LiquidButton
                  onClick={() => window.open(githubUrl, '_blank', 'noopener,noreferrer')}
                  backgroundColor="bg-slate-300/80 dark:bg-cyan-950"
                  textColor="text-sky-800 dark:text-cyan-200"
                  className="p-1"
                  data-hoverable="true"
                  aria-label="Open GitHub profile"
                >
                  <Github className="w-4 h-4" /> GitHub
                </LiquidButton>
              </div>
              <p className="mt-3 text-[11px] font-mono text-text-secondary break-all">{portfolioData.personal.email}</p>
            </ModuleContainer>
            <ScrollPrompt />
      </motion.section>


        {/* LEVEL 2: LAB / PROJECTS */}
      <motion.section data-level="2" ref={sectionRef(1)} {...sectionVariants} viewport={sectionViewport} className="w-full max-w-7xl mx-auto px-3 sm:px-6 md:px-12 lg:px-24 min-h-svh flex flex-col items-center justify-center py-16">
            <ModuleContainer className="w-full mb-3 md:mb-6 text-center !p-4 md:!p-6 shrink-0">
              <h2 className="text-sm font-mono text-sky-600 dark:text-nano-purple tracking-widest mb-2 font-bold">[ ARCHIVE_DATA ]</h2>
              <h3 className="text-2xl md:text-3xl font-space font-bold mb-2 text-text-primary">Deployments</h3>
              <p className="text-text-secondary font-mono text-xs md:text-sm">Accessing mission-critical project modules · Click simulator to test live</p>
            </ModuleContainer>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 overflow-y-auto custom-scrollbar scroll-zone pb-6 px-1 min-h-0 max-h-[46dvh] md:max-h-[58dvh]">
              {portfolioData.projects.map((proj, idx) => {
                const simulatorLabel = 
                  proj.id === 2 ? '⚡ RUN LIVE OS SIMULATOR' :
                  proj.id === 1 ? '⚡ TEST JWT AUTH & UPLOADER' :
                  '⚡ TEST REALTIME LEAD ENGINE';

                return (
                  <ModuleContainer 
                    key={idx} 
                    delay={0.1 + idx * 0.15} 
                    className="flex flex-col h-full !p-5 sm:!p-6 group hover:shadow-[0_0_25px_rgba(14,165,233,0.25)] dark:hover:shadow-[0_0_25px_rgba(168,85,247,0.25)] transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Hover Scanline */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-sky-500/10 dark:via-nano-purple/5 to-transparent -translate-y-full group-hover:animate-scanline pointer-events-none" />
                    
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-sky-600 dark:text-nano-purple bg-sky-100 dark:bg-nano-purple/10 p-2 rounded border border-sky-300 dark:border-nano-purple/30">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {proj.live && (
                          <a 
                            href={proj.live} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-text-secondary hover:text-sky-600 dark:hover:text-nano-cyan transition-colors p-1" 
                            title="Live Deployment" 
                            data-hoverable="true"
                          >
                            <ExternalLink size={17} />
                          </a>
                        )}
                        <a 
                          href={proj.github} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-text-secondary hover:text-sky-600 dark:hover:text-nano-cyan transition-colors p-1" 
                          title="View Source" 
                          data-hoverable="true"
                        >
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                        </a>
                      </div>
                    </div>

                    {/* Content */}
                    <h4 className="text-lg md:text-xl font-bold font-space text-text-primary mb-2 group-hover:text-sky-600 dark:group-hover:text-nano-purple transition-colors">{proj.title}</h4>
                    <p className="text-xs md:text-sm text-text-secondary mb-4 flex-grow leading-relaxed">{proj.description}</p>
                    
                    {/* Live Interactive Simulator CTA Button */}
                    <button
                      type="button"
                      onClick={() => {
                        terminalSound.playCommandEnter();
                        setSelectedSimulatorProject(proj);
                      }}
                      className="w-full py-2.5 px-3 mb-3.5 rounded-lg bg-sky-600 hover:bg-sky-700 dark:bg-nano-cyan/10 dark:hover:bg-nano-cyan/25 border border-sky-500 dark:border-nano-cyan/40 text-white dark:text-nano-cyan font-mono text-[11px] font-bold tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm dark:shadow-[0_0_12px_rgba(0,240,255,0.1)] group/btn"
                      data-hoverable="true"
                    >
                      <span>{simulatorLabel}</span>
                      <span className="group-hover/btn:translate-x-1 transition-transform">&rarr;</span>
                    </button>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1.5 pt-3 pb-1 border-t border-slate-200 dark:border-white/10 mt-auto">
                      {proj.techStack.map(t => (
                        <span key={t} className="text-[9px] font-mono font-semibold border border-sky-300 dark:border-nano-purple/30 bg-sky-50 dark:bg-nano-purple/5 px-1.5 py-0.5 rounded text-sky-800 dark:text-nano-purple/90 whitespace-nowrap">
                          {t}
                        </span>
                      ))}
                    </div>
                  </ModuleContainer>
                );
              })}
            </div>

            {/* Interactive Project Simulator Modal (lazy) */}
            <React.Suspense fallback={null}>
            <ProjectSimulatorModal
              project={selectedSimulatorProject}
              isOpen={!!selectedSimulatorProject}
              onClose={() => setSelectedSimulatorProject(null)}
            />
            </React.Suspense>
          </motion.section>

        {/* LEVEL 3: DNA / SKILLS (INTERACTIVE SKILL REACTOR) */}
      <motion.section data-level="3" ref={sectionRef(2)} {...sectionVariants} viewport={sectionViewport} className="w-full max-w-7xl mx-auto px-3 sm:px-6 md:px-12 lg:px-24 min-h-svh flex items-start justify-center py-16">
            <div className="flex flex-col items-center justify-start text-center w-full">
              <ModuleContainer className="max-w-5xl w-full !p-4 md:!p-6 lg:!p-8">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="text-left">
                    <h2 className="text-xs md:text-sm font-mono text-sky-600 dark:text-nano-orange font-bold tracking-widest mb-0.5">[ CAPABILITY_MATRIX // SKILL REACTOR ]</h2>
                    <p className="text-text-secondary text-[10px] md:text-xs font-mono font-medium">Tap a technology node to reveal linked mission deployments</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-100 dark:bg-nano-cyan/10 border border-sky-300 dark:border-nano-cyan/30 text-[10px] font-mono text-sky-800 dark:text-nano-cyan font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600 dark:bg-nano-cyan animate-pulse" />
                    <span>{portfolioData.skills.length} NEURAL NODES ACTIVE</span>
                  </div>
                </div>

                {/* Interactive Category Filter Pills */}
                <div className="flex flex-wrap gap-1.5 mb-4 pb-3 border-b border-slate-200 dark:border-white/10 text-left">
                  {['ALL', 'Frontend', 'Backend', 'ML & AI', 'Mobile', 'Cloud & DB', 'DevOps', 'Core'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        terminalSound.playHoverTick();
                        setSelectedSkillCategory(cat);
                      }}
                      className={`px-2.5 py-1 rounded-md font-mono text-[10px] font-bold uppercase tracking-wider transition-all ${
                        selectedSkillCategory === cat
                          ? 'bg-sky-600 text-white dark:bg-nano-cyan dark:text-slate-950 shadow-sm dark:shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                          : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-text-secondary hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-white/5'
                      }`}
                      data-hoverable="true"
                    >
                      {cat === 'ALL' ? `⚡ ALL (${portfolioData.skills.length})` : cat}
                    </button>
                  ))}
                </div>

                {/* Interactive Skill Reactor Telemetry Bar (When a node is selected) */}
                {selectedActiveSkill && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-2.5 rounded-xl bg-sky-50 dark:bg-nano-cyan/10 border border-sky-300 dark:border-nano-cyan/40 flex flex-wrap items-center justify-between gap-3 text-left font-mono text-xs shadow-md dark:shadow-[0_0_20px_rgba(0,240,255,0.15)]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sky-700 dark:text-nano-cyan font-bold">⚡ NODE:</span>
                      <span className="px-2 py-0.5 rounded bg-sky-600 text-white dark:bg-nano-cyan/20 dark:text-white font-bold">{selectedActiveSkill.name}</span>
                      <span className="text-slate-600 dark:text-slate-400 text-[11px]">➔ LINKED PROJECTS:</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {(() => {
                        const linked = getLinkedProjects(selectedActiveSkill.name);
                        if (linked.length === 0) {
                          return <span className="text-slate-500 dark:text-slate-400 italic text-[11px]">Powers full-stack algorithms & architecture</span>;
                        }
                        return linked.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => {
                              terminalSound.playCommandEnter();
                              setSelectedSimulatorProject(p);
                            }}
                            className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-700 text-white dark:bg-nano-purple/30 dark:hover:bg-nano-purple/50 font-bold border border-sky-500 dark:border-nano-purple/50 text-[10px] flex items-center gap-1.5 transition-all shadow-sm"
                            data-hoverable="true"
                          >
                            <span>🚀 {p.title}</span>
                            <span className="text-sky-200 dark:text-nano-cyan font-mono text-[9px]">[Launch Sim]</span>
                          </button>
                        ));
                      })()}
                    </div>
                  </motion.div>
                )}

                {/* Scrollable Category Groups */}
                <div className="space-y-3 md:space-y-4 text-left max-h-[34dvh] sm:max-h-[40dvh] md:max-h-[46dvh] lg:max-h-[50dvh] overflow-y-auto pr-1 custom-scrollbar scroll-zone">
                  {(() => {
                    const allCategories = ['Frontend', 'Backend', 'ML & AI', 'Mobile', 'Cloud & DB', 'DevOps', 'Core'];
                    const categories = selectedSkillCategory === 'ALL' 
                      ? allCategories 
                      : [selectedSkillCategory];

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
                      'Frontend': 'border-sky-500 dark:border-nano-cyan/40',
                      'Backend': 'border-emerald-600 dark:border-emerald-500/40',
                      'ML & AI': 'border-indigo-600 dark:border-nano-purple/40',
                      'Mobile': 'border-orange-500 dark:border-nano-orange/40',
                      'Cloud & DB': 'border-teal-600 dark:border-teal-500/40',
                      'DevOps': 'border-amber-600 dark:border-amber-500/40',
                      'Core': 'border-blue-600 dark:border-sky-500/40'
                    };
                    const categoryAccents = {
                      'Frontend': 'text-sky-600 dark:text-nano-cyan',
                      'Backend': 'text-emerald-700 dark:text-emerald-400',
                      'ML & AI': 'text-indigo-700 dark:text-nano-purple',
                      'Mobile': 'text-orange-600 dark:text-nano-orange',
                      'Cloud & DB': 'text-teal-700 dark:text-teal-400',
                      'DevOps': 'text-amber-700 dark:text-amber-400',
                      'Core': 'text-blue-700 dark:text-sky-400'
                    };

                    return categories.map((cat, ci) => {
                      const catSkills = portfolioData.skills.filter(s => s.category === cat);
                      if (catSkills.length === 0) return null;

                      return (
                        <div key={ci}>
                          {/* Category Header */}
                          <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                            <span className="text-sm md:text-base">{categoryIcons[cat] || '▸'}</span>
                            <span className={`text-[10px] md:text-xs font-mono tracking-widest font-bold uppercase ${categoryAccents[cat] || 'text-sky-600 dark:text-nano-cyan'}`}>
                              {cat}
                            </span>
                            <div className="flex-1 h-px bg-slate-200 dark:bg-white/10"></div>
                            <span className="text-[8px] md:text-[9px] font-mono text-text-secondary font-semibold">{catSkills.length} MODULES</span>
                          </div>

                          {/* Skills Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
                            {catSkills.map((skill, si) => {
                              const isSelected = selectedActiveSkill?.name === skill.name;
                              const linkedProjects = getLinkedProjects(skill.name);
                              const hasLinkedProjects = linkedProjects.length > 0;

                              return (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.25, delay: (si * 0.03) }}
                                  key={si}
                                  onClick={() => {
                                    terminalSound.playBootBleep(1);
                                    setSelectedActiveSkill(skill);
                                  }}
                                  onMouseEnter={() => {
                                    terminalSound.playHoverTick();
                                  }}
                                  className={`group relative flex flex-col border-l-2 ${
                                    isSelected 
                                      ? 'border-sky-600 dark:border-nano-cyan bg-sky-100/90 dark:bg-nano-cyan/15 shadow-md dark:shadow-[0_0_18px_rgba(0,240,255,0.25)]' 
                                      : `${categoryColors[cat] || 'border-sky-400 dark:border-nano-cyan/30'} bg-slate-100/80 dark:bg-slate-900/60 hover:bg-slate-200/90 dark:hover:bg-slate-800/80 border-t border-r border-b border-slate-200/80 dark:border-slate-800/50`
                                  } pl-2.5 md:pl-3 py-2 rounded-r-md transition-all duration-200 cursor-pointer overflow-hidden`}
                                  data-hoverable="true"
                                >
                                  {/* Decorative scanline hover effect */}
                                  <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-sky-500/10 dark:via-white/5 to-transparent -translate-y-full group-hover:animate-scanline pointer-events-none" />
                                  
                                  <div className="flex justify-between items-start w-full">
                                    <span className={`font-space text-xs md:text-sm font-bold leading-tight relative z-10 transition-all ${
                                      isSelected ? 'text-sky-900 dark:text-nano-cyan font-extrabold' : 'text-slate-900 dark:text-text-primary group-hover:text-sky-600 dark:group-hover:text-nano-cyan'
                                    }`}>
                                      {skill.name}
                                    </span>
                                    {hasLinkedProjects && (
                                      <span className="text-[8px] px-1 py-0.2 rounded bg-sky-600 text-white dark:bg-nano-purple/30 dark:text-nano-purple font-mono font-bold" title="Linked to active project deployment">
                                        ⚡ DEPLOY
                                      </span>
                                    )}
                                  </div>
                                  
                                  {/* % bars removed per owner choice — name + deploy link only */}
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
          </motion.section>

        {/* LEVEL 4: TROPHY RING */}
      <section data-level="4" ref={sectionRef(3)} className="relative w-full">
            <TrophyRingSection />
          </section>

        {/* LEVEL 5: CORE / CONTACT */}
      <motion.section data-level="5" ref={sectionRef(4)} {...sectionVariants} viewport={sectionViewport} className="w-full max-w-7xl mx-auto px-3 sm:px-6 md:px-12 lg:px-24 min-h-svh flex flex-col items-center justify-center py-16">
            <ContactTerminal data={portfolioData.socials} />
          </motion.section>

    </div>
  );
}
