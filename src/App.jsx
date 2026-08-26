import React, { useState, useEffect } from 'react';
import Loader from './components/ui/Loader';
import Cursor from './components/ui/Cursor';
import SoundToggle from './components/ui/SoundToggle';
import ThemeToggle from './components/ui/ThemeToggle';
import ZoomController from './components/layout/ZoomController';
import NanoScene from './components/canvas/NanoScene';
import { useScrollProgress } from './hooks/useScrollProgress';
import { useMouseParallax } from './hooks/useMouseParallax';
import { portfolioData } from './config/portfolio';

import { terminalSound } from './utils/terminalSound';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOverclocked, setIsOverclocked] = useState(false);
  const scrollProgress = useScrollProgress();
  const mousePos = useMouseParallax();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcut triggers: Shift + O & Konami Code (Up Up Down Down Left Right Left Right B A)
  useEffect(() => {
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let inputSequence = [];

    const handleKeyDown = (e) => {
      // 1. Shift + O
      if (e.shiftKey && (e.key === 'O' || e.key === 'o')) {
        terminalSound.playBootBleep(3);
        setIsOverclocked(prev => !prev);
        return;
      }

      // 2. Konami Code
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      inputSequence.push(key);
      if (inputSequence.length > konamiSequence.length) {
        inputSequence.shift();
      }

      if (inputSequence.join(',') === konamiSequence.join(',')) {
        terminalSound.playSuccessChime();
        setIsOverclocked(prev => !prev);
        inputSequence = [];
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* 500vh scroll container for the 5 states */}
      <div style={{ height: '500vh' }}>
        <Loader isLoading={isLoading} />

        {!isLoading && (
          <div className={isOverclocked ? "animate-pulse-fast" : ""}>
            <Cursor />
            <SoundToggle />
            <ThemeToggle />

            {/* Scan line overlay */}
            <div className="scan-line-overlay" />

            {/* Subtle grid background with mouse parallax */}
            <div className="grid-bg-container">
              <div 
                className="grid-bg" 
                style={{ 
                  transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)` 
                }} 
              />
            </div>

            {/* 3D Scene — fixed fullscreen */}
            <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
              <NanoScene scrollProgress={scrollProgress} mousePos={mousePos} isOverclocked={isOverclocked} />
            </div>

            {/* HTML UI Overlay — fixed, on top of 3D */}
            <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 10 }}>
              <ZoomController
                scrollProgress={scrollProgress}
                portfolioData={portfolioData}
                isOverclocked={isOverclocked}
                setIsOverclocked={setIsOverclocked}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
