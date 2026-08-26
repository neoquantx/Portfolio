import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Award, Calendar, ExternalLink, ShieldCheck, Lock } from 'lucide-react';
import { portfolioData } from '../../config/portfolio';
import { useTheme } from '../../context/ThemeContext';

const TrophyVaultModal = ({ isOpen, onClose }) => {
  const [selectedTrophy, setSelectedTrophy] = useState(null);
  const [decrypting, setDecrypting] = useState(false);
  const { isDark } = useTheme();

  const handleSelectTrophy = (trophy) => {
    setDecrypting(true);
    setSelectedTrophy(trophy);
    setTimeout(() => {
      setDecrypting(false);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 pointer-events-auto select-none"
        onClick={onClose}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-5xl h-[85vh] rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl border transition-colors duration-300 ${
            isDark 
              ? 'bg-slate-950/95 border-cyan-500/30 text-slate-100 shadow-[0_0_50px_rgba(0,240,255,0.15)]' 
              : 'bg-slate-50/95 border-sky-500/30 text-slate-900 shadow-[0_20px_50px_rgba(14,165,233,0.2)]'
          }`}
        >
          {/* Header (Mobile) / Sidebar */}
          <div className={`md:w-1/3 border-b md:border-b-0 md:border-r flex flex-col transition-colors ${
            isDark ? 'border-cyan-500/20 bg-slate-900/60' : 'border-sky-500/20 bg-slate-100/90'
          }`}>
            <div className={`p-5 sm:p-6 border-b flex justify-between items-center ${
              isDark ? 'border-cyan-500/20' : 'border-sky-500/20'
            }`}>
              <div>
                <div className="flex items-center gap-3">
                  <Trophy className={`w-6 h-6 ${isDark ? 'text-nano-cyan' : 'text-sky-600'}`} />
                  <h2 className={`text-xl font-bold tracking-widest uppercase font-space ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>Mission Logs</h2>
                </div>
                <p className={`text-xs mt-1 font-mono ${isDark ? 'text-cyan-400/70' : 'text-sky-600'}`}>
                  ENCRYPTED_ACHIEVEMENTS_VAULT
                </p>
              </div>

              {/* Close Button Mobile */}
              <button 
                type="button"
                onClick={onClose}
                className={`md:hidden p-2 rounded-lg border transition-colors ${
                  isDark ? 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white' : 'border-slate-300 bg-slate-200 text-slate-700 hover:text-black'
                }`}
                data-hoverable="true"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of Trophies */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {portfolioData.hackathons.map((hackathon) => {
                const isSelected = selectedTrophy?.id === hackathon.id;
                return (
                  <button
                    key={hackathon.id}
                    type="button"
                    onClick={() => handleSelectTrophy(hackathon)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
                      isSelected 
                        ? isDark 
                          ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-[0_0_15px_rgba(0,240,255,0.2)]' 
                          : 'border-sky-500 bg-sky-100/80 text-sky-950 font-semibold shadow-[0_0_15px_rgba(14,165,233,0.2)]'
                        : isDark
                          ? 'border-slate-800 hover:border-cyan-500/40 bg-slate-900/40 text-slate-300 hover:bg-slate-900/80'
                          : 'border-slate-300 hover:border-sky-400 bg-white/80 text-slate-700 hover:bg-white'
                    }`}
                    data-hoverable="true"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-bold transition-colors line-clamp-1 ${
                        isSelected 
                          ? isDark ? 'text-cyan-300' : 'text-sky-900'
                          : isDark ? 'text-slate-200 group-hover:text-cyan-300' : 'text-slate-800 group-hover:text-sky-700'
                      }`}>
                        {hackathon.title}
                      </h3>
                    </div>
                    <div className={`flex items-center gap-3 text-xs font-mono ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {hackathon.date}</span>
                      <span>|</span>
                      <span className={isDark ? 'text-cyan-400 font-bold' : 'text-sky-600 font-bold'}>{hackathon.role}</span>
                    </div>
                    
                    {/* Active Indicator */}
                    {isSelected && (
                      <motion.div 
                        layoutId="active-indicator"
                        className={`absolute left-0 top-0 bottom-0 w-1 ${
                          isDark ? 'bg-cyan-400 shadow-[0_0_10px_#00f0ff]' : 'bg-sky-500 shadow-[0_0_10px_#0ea5e9]'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className={`flex-1 flex flex-col relative ${
            isDark 
              ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/50 via-slate-950 to-slate-950' 
              : 'bg-white/90'
          }`}>
            {/* Close Button Desktop */}
            <button 
              type="button"
              onClick={onClose}
              className={`hidden md:flex absolute top-5 right-5 z-20 p-2.5 rounded-full border transition-all ${
                isDark 
                  ? 'border-slate-700 bg-slate-900/80 text-slate-300 hover:text-rose-400 hover:border-rose-500/50 hover:bg-slate-800' 
                  : 'border-slate-300 bg-slate-100 text-slate-700 hover:text-rose-600 hover:border-rose-400 hover:bg-slate-200'
              }`}
              title="Close Vault"
              data-hoverable="true"
            >
              <X className="w-5 h-5" />
            </button>

            {selectedTrophy ? (
              <div className="flex-1 p-6 sm:p-10 overflow-y-auto custom-scrollbar flex flex-col">
                {decrypting ? (
                  <div className={`flex-1 flex flex-col items-center justify-center font-mono space-y-4 ${
                    isDark ? 'text-cyan-400' : 'text-sky-600'
                  }`}>
                    <Lock className="w-12 h-12 animate-pulse" />
                    <p className="animate-pulse tracking-widest">DECRYPTING FILE...</p>
                    <div className={`w-48 h-1.5 overflow-hidden rounded-full mt-4 ${
                      isDark ? 'bg-slate-800' : 'bg-slate-300'
                    }`}>
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: "100%" }} 
                        transition={{ duration: 0.5 }} 
                        className={`h-full ${isDark ? 'bg-cyan-400 shadow-[0_0_10px_#00f0ff]' : 'bg-sky-500'}`}
                      />
                    </div>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 flex flex-col max-w-3xl mx-auto w-full"
                  >
                    <div className={`flex items-center gap-2 font-mono text-xs font-bold mb-3 ${
                      isDark ? 'text-cyan-400' : 'text-sky-600'
                    }`}>
                      <ShieldCheck className="w-4 h-4" />
                      <span>CLEARANCE: GRANTED // LOG #{selectedTrophy.id.toUpperCase()}</span>
                    </div>
                    
                    <h2 className={`text-2xl sm:text-4xl font-bold font-space mb-2 leading-tight ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {selectedTrophy.title}
                    </h2>
                    
                    <div className={`flex flex-wrap items-center gap-4 text-xs sm:text-sm font-mono mb-6 border-b pb-4 ${
                      isDark ? 'border-slate-800' : 'border-slate-200'
                    }`}>
                      <span className={`px-3 py-1 rounded-full border font-bold ${
                        isDark ? 'bg-cyan-950/50 text-cyan-300 border-cyan-500/40' : 'bg-sky-100 text-sky-800 border-sky-300'
                      }`}>
                        {selectedTrophy.role}
                      </span>
                      <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        <Calendar className="w-4 h-4" /> {selectedTrophy.date}
                      </span>
                    </div>

                    <div className="space-y-6 flex-1">
                      <div>
                        <h4 className={`text-xs font-bold tracking-widest uppercase mb-2 ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>Mission Briefing</h4>
                        <p className={`leading-relaxed text-base sm:text-lg ${
                          isDark ? 'text-slate-200' : 'text-slate-800'
                        }`}>
                          {selectedTrophy.description}
                        </p>
                      </div>

                      <div>
                        <h4 className={`text-xs font-bold tracking-widest uppercase mb-2 ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>Core Competencies</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedTrophy.tags.map((tag, i) => (
                            <span 
                              key={i} 
                              className={`px-3 py-1 rounded text-xs font-mono font-medium border ${
                                isDark 
                                  ? 'bg-slate-900 border-slate-700 text-slate-300' 
                                  : 'bg-slate-100 border-slate-300 text-slate-800'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Certificate Viewer */}
                      <div className={`mt-6 pt-6 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                        <h4 className={`text-xs font-bold tracking-widest uppercase mb-3 flex items-center gap-2 ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          <Award className="w-4 h-4" /> Official Credential Verification
                        </h4>
                        
                        <div className={`w-full aspect-[4/3] max-h-[300px] border rounded-xl overflow-hidden relative group flex items-center justify-center ${
                          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'
                        }`}>
                          {selectedTrophy.certificate_url ? (
                            <>
                              <img 
                                src={selectedTrophy.certificate_url} 
                                alt={`${selectedTrophy.title} Certificate`}
                                className="w-full h-full object-contain p-2"
                              />
                              <div className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                <a 
                                  href={selectedTrophy.certificate_url} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="px-5 py-2.5 bg-cyan-400 text-slate-950 font-bold rounded-lg shadow-lg hover:scale-105 transition-transform flex items-center gap-2 font-mono text-sm"
                                >
                                  View Full Certificate <ExternalLink className="w-4 h-4" />
                                </a>
                              </div>
                            </>
                          ) : (
                            <div className="text-center p-6 flex flex-col items-center">
                              <div className={`w-14 h-14 rounded-full border-2 border-dashed flex items-center justify-center mb-3 ${
                                isDark ? 'border-slate-700 text-slate-600' : 'border-slate-300 text-slate-400'
                              }`}>
                                <Award className="w-7 h-7" />
                              </div>
                              <p className={`font-mono text-xs font-bold mb-1 ${
                                isDark ? 'text-slate-400' : 'text-slate-600'
                              }`}>NO_CERTIFICATE_DATA_FOUND</p>
                              <p className={`text-xs max-w-xs ${
                                isDark ? 'text-slate-500' : 'text-slate-500'
                              }`}>
                                Credential image file pending upload to portfolio vault.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <Trophy className={`w-16 h-16 mb-4 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
                <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                  Mission Log Vault Active
                </h3>
                <p className={`text-sm max-w-md ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                  Select a hackathon entry from the sidebar to inspect credentials and mission telemetry.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TrophyVaultModal;
