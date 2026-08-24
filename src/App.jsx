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

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const scrollProgress = useScrollProgress();
  const mousePos = useMouseParallax();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* 500vh scroll container for the 5 states */}
      <div style={{ height: '500vh' }}>
        <Loader isLoading={isLoading} />

        {!isLoading && (
          <>
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
              <NanoScene scrollProgress={scrollProgress} mousePos={mousePos} />
            </div>

            {/* HTML UI Overlay — fixed, on top of 3D */}
            <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 10 }}>
              <ZoomController
                scrollProgress={scrollProgress}
                portfolioData={portfolioData}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
