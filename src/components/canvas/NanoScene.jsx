import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import PostProcessing from './PostProcessing';
import NanobotSwarm from './NanobotSwarm';
import { useTheme } from '../../context/ThemeContext';

export default function NanoScene({ isOverclocked }) {
  const { isDark } = useTheme();
  const [perf, setPerf] = useState(() => {
    try {
      const coarse = window.matchMedia?.('(pointer: coarse)').matches;
      const narrow = window.innerWidth < 768;
      const lowCores = (navigator.hardwareConcurrency || 8) <= 4;
      const isMobile = coarse || narrow;
      const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      return {
        isMobile,
        lowCores,
        prefersReduced,
        dprMax: isMobile || lowCores ? 1 : 1.5,
        quality: isMobile || lowCores ? 'low' : 'high'
      };
    } catch { return { isMobile: false, lowCores: false, prefersReduced: false, dprMax: 1.5, quality: 'high' }; }
  });

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const update = () => {
      try {
        const coarse = mq.matches;
        const narrow = window.innerWidth < 768;
        const lowCores = (navigator.hardwareConcurrency || 8) <= 4;
        const isMobile = coarse || narrow;
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        setPerf({
          isMobile,
          lowCores,
          prefersReduced,
          dprMax: isMobile || lowCores ? 1 : 1.5,
          quality: isMobile || lowCores ? 'low' : 'high'
        });
      } catch {}
    };
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 45 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      dpr={[1, perf.dprMax]}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance", stencil: false, depth: true }}
      flat={perf.quality === 'low'}
    >
      {/* Background color only in dark mode. Light mode handles it via CSS. */}
      {isDark && <color attach="background" args={['#020617']} />}
      
      {/* Dynamic fog based on theme */}
      {isDark ? (
        <fog attach="fog" args={['#020617', 25, 95]} />
      ) : (
        <fog attach="fog" args={['#e2e8f0', 45, 140]} />
      )}
      
      <ambientLight intensity={isDark ? 0.3 : 1.2} />
      <pointLight position={[12, 12, 10]} intensity={isDark ? 1.2 : 2.5} color={isDark ? '#00f0ff' : '#0284c7'} />
      <pointLight position={[-12, -12, -10]} intensity={isDark ? 0.8 : 1.5} color={isDark ? '#a855f7' : '#1d4ed8'} />

      {/* The 3D swarm floating — adaptive particle count handled inside */}
      <NanobotSwarm 
        isOverclocked={isOverclocked}
        perf={perf}
      />

      {/* Post Processing — low tier skips Bloom/ChromaticAberration for 60fps on phones */}
      <PostProcessing 
        bloomIntensity={isDark ? 0.8 : 0.4} 
        enableNoise={false} 
        quality={perf.quality}
      />
    </Canvas>
  );
}
