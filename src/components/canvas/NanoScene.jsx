import React from 'react';
import { Canvas } from '@react-three/fiber';
import PostProcessing from './PostProcessing';
import NanobotSwarm from './NanobotSwarm';
import { useTheme } from '../../context/ThemeContext';

export default function NanoScene({ scrollProgress, mousePos }) {
  const { isDark } = useTheme();

  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 45 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      dpr={[1, 2]}
      gl={{ alpha: true }} 
    >
      {/* Background color only in dark mode. Light mode handles it via CSS. */}
      {isDark && <color attach="background" args={['#020617']} />}
      
      {/* Dynamic fog based on theme */}
      <fog attach="fog" args={[isDark ? '#020617' : '#e2e8f0', 20, 80]} />
      
      <ambientLight intensity={isDark ? 0.2 : 0.8} />
      <pointLight position={[10, 10, 10]} intensity={isDark ? 1 : 2} color={isDark ? '#00f0ff' : '#0ea5e9'} />
      <pointLight position={[-10, -10, -10]} intensity={isDark ? 0.5 : 1} color={isDark ? '#a855f7' : '#0284c7'} />

      {/* The 3D swarm floating */}
      <NanobotSwarm scrollProgress={scrollProgress} mousePos={mousePos} />

      {/* Post Processing - adjust bloom for light/dark */}
      <PostProcessing bloomIntensity={isDark ? 0.8 : 0.4} />
    </Canvas>
  );
}
