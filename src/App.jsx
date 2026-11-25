import React, { useState, useEffect } from 'react';
import Loader from './components/ui/Loader';
import Cursor from './components/ui/Cursor';
import SoundToggle from './components/ui/SoundToggle';
import ThemeToggle from './components/ui/ThemeToggle';
import ZoomController from './components/layout/ZoomController';
import DataRain from './components/ui/data-rain';
import TerminalEasterEgg from './components/ui/TerminalEasterEgg';
import { useMouseParallax } from './hooks/useMouseParallax';
import { portfolioData } from './config/portfolio';
import { terminalSound } from './utils/terminalSound';
import { useTheme } from './context/ThemeContext';

// Isolated component so mouse moves don't re-render the whole App
function GridBackground() {
  const bgRef = React.useRef(null);
  const isTouch = React.useMemo(() => {
    try { return window.matchMedia?.('(pointer: coarse)').matches; } catch { return false; }
  }, []);
  const prefersReduced = React.useMemo(() => {
    try { return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches; } catch { return false; }
  }, []);
  // Disable parallax on touch/reduced-motion: it causes iOS jank + battery drain
  useMouseParallax(bgRef, 0.08, -20, { disabled: isTouch || prefersReduced });
  return (
    <div className="grid-bg-container">
      <div
        ref={bgRef}
        className="grid-bg"
      />
    </div>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOverclocked, setIsOverclocked] = useState(false);
  const { isDark } = useTheme();

  // DataRain palette follows the app theme (project accents only).
  const rainPalette = React.useMemo(() => (isDark
    ? { calm: '#00f0ff', mid: '#a855f7', hot: '#f97316' }
    : { calm: '#0ea5e9', mid: '#3b82f6', hot: '#f97316' }), [isDark]);

  // Keyboard shortcuts: Shift+O and Konami Code
  useEffect(() => {
    const konamiSequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let inputSequence = [];

    const handleKeyDown = (e) => {
      if (e.shiftKey && (e.key === 'O' || e.key === 'o')) {
        terminalSound.playBootBleep(3);
        setIsOverclocked(prev => !prev);
        return;
      }
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      inputSequence.push(key);
      if (inputSequence.length > konamiSequence.length) inputSequence.shift();
      if (inputSequence.join(',') === konamiSequence.join(',')) {
        terminalSound.playSuccessChime();
        setIsOverclocked(prev => !prev);
        inputSequence = [];
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Global click feedback (previously lived in the 3D swarm): every
  // pointer-down resumes the audio engine and fires a burst.
  useEffect(() => {
    const onDown = () => {
      try {
        terminalSound.init();
        terminalSound.playShockwaveBurst();
      } catch {}
    };
    window.addEventListener('pointerdown', onDown);
    return () => window.removeEventListener('pointerdown', onDown);
  }, []);

  return (
    <>
      {/* Loader — z-index 9999, on top of everything */}
      {isLoading && <Loader onComplete={() => setIsLoading(false)} />}

      {/* Portfolio sections live in normal document flow and scroll natively.
          The 3D canvas + grid stay fixed behind them. */}
      <div className={isOverclocked ? 'animate-pulse-fast' : ''}>

        {/* UI elements — only show after load to prevent click-through */}
        {!isLoading && (
          <>
            <Cursor />
            <SoundToggle />
            <ThemeToggle />
          </>
        )}

        {/* Scan line overlay */}
        <div className="scan-line-overlay" style={{ zIndex: 5 }} />

        {/* Grid parallax background — z-index 0 */}
        <GridBackground />

        {/* DataRain canvas background — z-index 1 */}
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          <DataRain palette={rainPalette} />
        </div>

        {/* Content sections — real page flow, z-index 10 */}
        {!isLoading && (
          <div className="relative" style={{ zIndex: 10 }}>
            <ZoomController
              portfolioData={portfolioData}
              isOverclocked={isOverclocked}
              setIsOverclocked={setIsOverclocked}
            />
          </div>
        )}

        {/* Terminal Easter Egg — z-index 20, above UI but below modals */}
        {!isLoading && (
          <div style={{ zIndex: 20 }}>
            <TerminalEasterEgg setIsOverclocked={setIsOverclocked} />
          </div>
        )}

      </div>
    </>
  );
}
