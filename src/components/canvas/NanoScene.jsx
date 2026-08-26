import React from 'react';
import { Canvas } from '@react-three/fiber';
import PostProcessing from './PostProcessing';
import NanobotSwarm from './NanobotSwarm';
import { useTheme } from '../../context/ThemeContext';

export default function NanoScene({ scrollProgress, mousePos, isOverclocked }) {
  const { isDark } = useTheme();

  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 45 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }} 
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

      {/* The 3D swarm floating */}
      <NanobotSwarm 
        scrollProgress={scrollProgress} 
        mousePos={mousePos} 
        isOverclocked={isOverclocked}
      />

      {/* Post Processing - adjust bloom for light/dark */}
      <PostProcessing bloomIntensity={isDark ? 0.8 : 0.4} />
    </Canvas>
  );
}
