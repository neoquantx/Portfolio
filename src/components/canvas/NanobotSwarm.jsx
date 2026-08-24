import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

const PARTICLE_COUNT = 15000;

const vertexShader = `
uniform float uTime;
uniform float uMorphProgress;
uniform vec3 uColorDark;
uniform vec3 uColorLight;
uniform float uIsDark;

attribute vec3 pos0; // Cloud
attribute vec3 pos1; // Shield
attribute vec3 pos2; // Helix
attribute vec3 pos3; // Core

varying vec3 vColor;
varying float vAlpha;

void main() {
  // Determine which two states we are morphing between based on uMorphProgress (0.0 to 3.0)
  float stage = clamp(uMorphProgress, 0.0, 3.0);
  
  vec3 currentPos;
  
  if (stage < 1.0) {
    currentPos = mix(pos0, pos1, stage);
  } else if (stage < 2.0) {
    currentPos = mix(pos1, pos2, stage - 1.0);
  } else {
    currentPos = mix(pos2, pos3, stage - 2.0);
  }
  
  // Add some fluid floating motion
  currentPos.y += sin(uTime * 0.5 + currentPos.x) * 0.5;
  currentPos.x += cos(uTime * 0.3 + currentPos.y) * 0.5;
  
  vec4 mvPosition = modelViewMatrix * vec4(currentPos, 1.0);
  
  // Size attenuation
  gl_PointSize = (150.0 / -mvPosition.z);
  
  gl_Position = projectionMatrix * mvPosition;
  
  // Mix colors based on theme
  vec3 baseColor = mix(uColorLight, uColorDark, uIsDark);
  
  // Add depth-based color/alpha fading
  float depth = smoothstep(10.0, -30.0, mvPosition.z);
  vColor = mix(baseColor * 0.2, baseColor, depth);
  vAlpha = depth * 0.8 + 0.2;
}
`;

const fragmentShader = `
varying vec3 vColor;
varying float vAlpha;

void main() {
  // Circular soft particle
  vec2 xy = gl_PointCoord.xy - vec2(0.5);
  float ll = length(xy);
  if (ll > 0.5) discard;
  
  float glow = smoothstep(0.5, 0.0, ll);
  gl_FragColor = vec4(vColor, vAlpha * glow);
}
`;

export default function NanobotSwarm({ scrollProgress = 0, mousePos = {x: 0, y: 0} }) {
  const currentProgress = useRef(0);
  const pointsRef = useRef();
  const { isDark } = useTheme();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMorphProgress: { value: 0 },
    uIsDark: { value: 1.0 },
    uColorDark: { value: new THREE.Color('#00f0ff') },
    uColorLight: { value: new THREE.Color('#0284c7') }
  }), []);

  const geometryData = useMemo(() => {
    const pos0 = new Float32Array(PARTICLE_COUNT * 3); // Cloud
    const pos1 = new Float32Array(PARTICLE_COUNT * 3); // Hex Shield
    const pos2 = new Float32Array(PARTICLE_COUNT * 3); // Helix
    const pos3 = new Float32Array(PARTICLE_COUNT * 3); // Core

    // Target 0: Random Cloud (Surface)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = 40 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      pos0[i*3] = r * Math.sin(phi) * Math.cos(theta);
      pos0[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      pos0[i*3+2] = r * Math.cos(phi) - 20;
    }

    // Target 1: Hex Shield (Projects/Lab)
    // Form a wide grid on XY plane
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = 30 * Math.sqrt(Math.random());
      const angle = Math.random() * 2 * Math.PI;
      pos1[i*3] = radius * Math.cos(angle);
      pos1[i*3+1] = radius * Math.sin(angle);
      pos1[i*3+2] = (Math.random() - 0.5) * 2 - 15; // slightly wavy
    }

    // Target 2: Double Helix (Skills)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = (i / PARTICLE_COUNT) * Math.PI * 8; // 4 turns
      const strand = i % 2 === 0 ? 1 : -1;
      const radius = 8;
      pos2[i*3] = Math.cos(t + (strand === 1 ? 0 : Math.PI)) * radius;
      pos2[i*3+1] = (t / (Math.PI * 8) - 0.5) * 40; // Height spread
      pos2[i*3+2] = Math.sin(t + (strand === 1 ? 0 : Math.PI)) * radius - 20;
      
      // Add some scatter around the helix
      pos2[i*3] += (Math.random() - 0.5) * 2;
      pos2[i*3+1] += (Math.random() - 0.5) * 2;
      pos2[i*3+2] += (Math.random() - 0.5) * 2;
    }

    // Target 3: Core/Brain (Contact)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = 10 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      pos3[i*3] = r * Math.sin(phi) * Math.cos(theta);
      pos3[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      pos3[i*3+2] = r * Math.cos(phi) - 25;
    }

    return { pos0, pos1, pos2, pos3 };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current || !pointsRef.current.material) return;
    
    // Animate morph progress smoothly
    currentProgress.current = THREE.MathUtils.lerp(
      currentProgress.current,
      scrollProgress * 3.0,
      0.05
    );
    pointsRef.current.material.uniforms.uMorphProgress.value = currentProgress.current;
    pointsRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
    pointsRef.current.material.uniforms.uIsDark.value = isDark ? 1.0 : 0.0;
    
    // Rotate the entire swarm slightly over time and react to mouse parallax
    pointsRef.current.rotation.x = state.clock.elapsedTime * 0.05 + (mousePos?.y || 0) * 0.2;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1 + (mousePos?.x || 0) * 0.2;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={geometryData.pos0} itemSize={3} />
        <bufferAttribute attach="attributes-pos0" count={PARTICLE_COUNT} array={geometryData.pos0} itemSize={3} />
        <bufferAttribute attach="attributes-pos1" count={PARTICLE_COUNT} array={geometryData.pos1} itemSize={3} />
        <bufferAttribute attach="attributes-pos2" count={PARTICLE_COUNT} array={geometryData.pos2} itemSize={3} />
        <bufferAttribute attach="attributes-pos3" count={PARTICLE_COUNT} array={geometryData.pos3} itemSize={3} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
