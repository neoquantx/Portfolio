import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { terminalSound } from '../../utils/terminalSound';

const PARTICLE_COUNT = 9000;

const vertexShader = `
uniform float uTime;
uniform float uMorphProgress;
uniform vec3 uColorDark;
uniform vec3 uColorLight;
uniform vec3 uColorOverclock;
uniform float uIsDark;
uniform float uOverclock;

// 3D Graviton & Shockwave Uniforms (in local object coordinates)
uniform vec3 uMousePos3D;
uniform float uMouseActive;
uniform vec3 uShockwavePos;
uniform float uShockwaveTime;

attribute vec3 pos0; // Cloud (Lvl 1)
attribute vec3 pos1; // Hex Shield (Lvl 2)
attribute vec3 pos2; // Double Helix (Lvl 3 & 4)
attribute vec3 pos3; // Core Orb (Lvl 5)

varying vec3 vColor;
varying float vAlpha;

void main() {
  // Morph between states based on uMorphProgress (0.0 to 3.0)
  float stage = clamp(uMorphProgress, 0.0, 3.0);
  
  vec3 currentPos;
  if (stage < 1.0) {
    currentPos = mix(pos0, pos1, stage);
  } else if (stage < 2.0) {
    currentPos = mix(pos1, pos2, stage - 1.0);
  } else {
    currentPos = mix(pos2, pos3, stage - 2.0);
  }
  
  // Base fluid floating motion
  float timeSpeed = mix(1.0, 2.5, uOverclock);
  currentPos.y += sin(uTime * 0.5 * timeSpeed + currentPos.x * 0.2) * 0.6;
  currentPos.x += cos(uTime * 0.3 * timeSpeed + currentPos.y * 0.2) * 0.6;
  
  // Pure Original Colors (No muddy secondary mix in Dark Mode!)
  vec3 baseColor = mix(uColorLight, uColorDark, uIsDark);
  baseColor = mix(baseColor, uColorOverclock, uOverclock);

  // --- 1. MOUSE GRAVITON REPULSION ---
  if (uMouseActive > 0.5) {
    vec3 toMouse = currentPos - uMousePos3D;
    float distToMouse = length(toMouse);
    float mouseRadius = 22.0;
    
    if (distToMouse < mouseRadius) {
      float normDist = distToMouse / mouseRadius;
      float force = (1.0 - normDist) * (1.0 - normDist);
      vec3 repelDir = normalize(toMouse + vec3(0.0001));
      vec3 swirlDir = vec3(-repelDir.y, repelDir.x, repelDir.z * 0.2);
      
      currentPos += (repelDir * 11.0 + swirlDir * 3.5) * force;
      
      if (uIsDark > 0.5) {
        baseColor += vec3(0.2, 0.6, 0.8) * force * 1.2;
      }
    }
  }

  // --- 2. CLICK SHOCKWAVE HARMONIC RIPPLE ---
  if (uShockwaveTime > 0.0 && uShockwaveTime < 1.0) {
    float waveDist = length(currentPos - uShockwavePos);
    float waveProgress = sin(uShockwaveTime * 1.5707963);
    float waveRadius = waveProgress * 60.0;
    float waveWidth = 14.0;
    float distDelta = abs(waveDist - waveRadius);
    
    if (distDelta < waveWidth) {
      float waveNorm = 1.0 - (distDelta / waveWidth);
      float waveFade = 1.0 - uShockwaveTime;
      float ripple = sin(waveNorm * 3.1415926) * waveNorm * waveFade;
      vec3 pushDir = normalize(currentPos - uShockwavePos + vec3(0.0001));
      
      currentPos += pushDir * ripple * 14.0;
      currentPos.z += ripple * 18.0;
      
      if (uIsDark > 0.5) {
        baseColor += vec3(0.4, 0.8, 1.0) * ripple * 2.0;
      }
    }
  }

  vec4 mvPosition = modelViewMatrix * vec4(currentPos, 1.0);
  
  // --- MEDIUM PARTICLE SIZE WITH BALANCED CLAMP (8px - 26px) ---
  float pSize = (320.0 / -mvPosition.z);
  gl_PointSize = clamp(pSize, 7.5, 26.0);
  
  gl_Position = projectionMatrix * mvPosition;
  
  // Extended depth shading
  float depth = smoothstep(15.0, -50.0, mvPosition.z);
  
  if (uIsDark > 0.5) {
    vColor = mix(baseColor * 0.3, baseColor, depth);
    vAlpha = depth * 0.8 + 0.2;
  } else {
    vColor = baseColor;
    vAlpha = clamp(depth * 0.75 + 0.25, 0.25, 0.9);
  }
}
`;

const fragmentShader = `
uniform float uIsDark;
varying vec3 vColor;
varying float vAlpha;

void main() {
  vec2 xy = gl_PointCoord.xy - vec2(0.5);
  float ll = length(xy);
  if (ll > 0.5) discard;
  
  float glow = smoothstep(0.5, 0.0, ll);
  float core = smoothstep(0.18, 0.0, ll) * 0.6;
  
  if (uIsDark > 0.5) {
    // Pure glowing neon orb in Dark Mode
    gl_FragColor = vec4(vColor + vec3(core), vAlpha * glow);
  } else {
    // Crisp soft blue orb in Light Mode
    float alpha = smoothstep(0.5, 0.05, ll) * vAlpha;
    gl_FragColor = vec4(vColor, alpha);
  }
}
`;

export default function NanobotSwarm({ 
  scrollProgress = 0, 
  mousePos = {x: 0, y: 0},
  isOverclocked = false 
}) {
  const currentProgress = useRef(0);
  const pointsRef = useRef();
  const { isDark } = useTheme();
  
  const windowMouseNorm = useRef({ x: 0, y: 0 });
  const isMouseActive = useRef(false);
  
  const shockwaveRef = useRef({
    time: 0.0,
    active: false,
    localPos: new THREE.Vector3(0, 0, -18)
  });
  
  const smoothMouseLocal = useRef(new THREE.Vector3(0, 0, -18));

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMorphProgress: { value: 0 },
    uIsDark: { value: 1.0 },
    uOverclock: { value: 0.0 },
    uColorDark: { value: new THREE.Color('#00f0ff') },       // Pure Original Plasma Cyan
    uColorLight: { value: new THREE.Color('#0284c7') },      // Ocean Cyan / Sky Blue
    uColorOverclock: { value: new THREE.Color('#ff0055') },  // Turbo Neon Red
    uMousePos3D: { value: new THREE.Vector3(0, 0, -18) },
    uMouseActive: { value: 0.0 },
    uShockwavePos: { value: new THREE.Vector3(0, 0, -18) },
    uShockwaveTime: { value: 0.0 }
  }), []);

  useEffect(() => {
    const handlePointerMove = (e) => {
      windowMouseNorm.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      windowMouseNorm.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      isMouseActive.current = true;
    };

    const handlePointerLeave = () => {
      isMouseActive.current = false;
    };

    const handlePointerDown = (e) => {
      windowMouseNorm.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      windowMouseNorm.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      
      shockwaveRef.current.time = 0.001;
      shockwaveRef.current.active = true;
      shockwaveRef.current.localPos.copy(smoothMouseLocal.current);

      terminalSound.playShockwaveBurst();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('mouseleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, []);

  const geometryData = useMemo(() => {
    const pos0 = new Float32Array(PARTICLE_COUNT * 3); // Lvl 1: Cloud
    const pos1 = new Float32Array(PARTICLE_COUNT * 3); // Lvl 2: Wide Shield Lattice
    const pos2 = new Float32Array(PARTICLE_COUNT * 3); // Lvl 3 & 4: Double Helix & Outer Ring
    const pos3 = new Float32Array(PARTICLE_COUNT * 3); // Lvl 5: Wide Orbiting Sphere & Rings

    // Target 0: Random Cloud (Surface / Hero)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = 36 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      pos0[i*3] = r * Math.sin(phi) * Math.cos(theta);
      pos0[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      pos0[i*3+2] = r * Math.cos(phi) - 16;
    }

    // Target 1: Hex Shield Lattice (Lvl 2) - Frames bio card nicely
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = 28 * Math.sqrt(Math.random());
      const angle = Math.random() * 2 * Math.PI;
      pos1[i*3] = radius * Math.cos(angle);
      pos1[i*3+1] = radius * Math.sin(angle);
      pos1[i*3+2] = (Math.random() - 0.5) * 6 - 15;
    }

    // Target 2: Double Helix & Constellation (Lvl 3 & 4)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = (i / PARTICLE_COUNT) * Math.PI * 8;
      const strand = i % 2 === 0 ? 1 : -1;
      const radius = 18 + (Math.random() - 0.5) * 4;
      pos2[i*3] = Math.cos(t + (strand === 1 ? 0 : Math.PI)) * radius;
      pos2[i*3+1] = ((i / PARTICLE_COUNT) - 0.5) * 44;
      pos2[i*3+2] = Math.sin(t + (strand === 1 ? 0 : Math.PI)) * radius - 16;
      
      pos2[i*3] += (Math.random() - 0.5) * 2;
      pos2[i*3+1] += (Math.random() - 0.5) * 2;
      pos2[i*3+2] += (Math.random() - 0.5) * 2;
    }

    // Target 3: Orbiting Quantum Core Sphere (Lvl 5)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = 22 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      pos3[i*3] = r * Math.sin(phi) * Math.cos(theta);
      pos3[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      pos3[i*3+2] = r * Math.cos(phi) - 16;
    }

    return { pos0, pos1, pos2, pos3 };
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current || !pointsRef.current.material) return;
    
    // 1. Unproject window mouse coords to 3D world space
    const vector = new THREE.Vector3(windowMouseNorm.current.x, windowMouseNorm.current.y, 0.5);
    vector.unproject(state.camera);
    const dir = vector.sub(state.camera.position).normalize();
    const targetZ = -16;
    const distToPlane = (targetZ - state.camera.position.z) / (dir.z || 0.0001);
    const worldMouse = state.camera.position.clone().add(dir.multiplyScalar(distToPlane));

    // 2. Convert to local object space
    const localMouseTarget = worldMouse.clone();
    pointsRef.current.worldToLocal(localMouseTarget);
    smoothMouseLocal.current.lerp(localMouseTarget, 0.22);

    // Animate morph progress smoothly
    currentProgress.current = THREE.MathUtils.lerp(
      currentProgress.current,
      scrollProgress * 3.0,
      0.06
    );

    // Update shockwave time progress
    if (shockwaveRef.current.active) {
      shockwaveRef.current.time += delta * 0.75;
      if (shockwaveRef.current.time >= 1.0) {
        shockwaveRef.current.time = 0.0;
        shockwaveRef.current.active = false;
      }
    }

    const matUniforms = pointsRef.current.material.uniforms;
    matUniforms.uMorphProgress.value = currentProgress.current;
    matUniforms.uTime.value = state.clock.elapsedTime;
    matUniforms.uIsDark.value = isDark ? 1.0 : 0.0;
    matUniforms.uOverclock.value = THREE.MathUtils.lerp(
      matUniforms.uOverclock.value,
      isOverclocked ? 1.0 : 0.0,
      0.1
    );

    matUniforms.uMousePos3D.value.copy(smoothMouseLocal.current);
    matUniforms.uMouseActive.value = isMouseActive.current ? 1.0 : 0.0;
    matUniforms.uShockwavePos.value.copy(shockwaveRef.current.localPos);
    matUniforms.uShockwaveTime.value = shockwaveRef.current.time;
    
    // Smooth continuous rotation
    const rotSpeed = isOverclocked ? 0.12 : 0.04;
    pointsRef.current.rotation.x = state.clock.elapsedTime * rotSpeed + (mousePos?.y || 0) * 0.12;
    pointsRef.current.rotation.y = state.clock.elapsedTime * (rotSpeed * 1.6) + (mousePos?.x || 0) * 0.12;
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
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
}
