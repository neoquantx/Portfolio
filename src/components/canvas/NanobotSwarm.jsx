import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { terminalSound } from '../../utils/terminalSound';

const PARTICLE_COUNT = 8500;

// Scratch vectors to eliminate GC pauses
const _scratchVec = new THREE.Vector3();
const _scratchDir = new THREE.Vector3();
const _scratchWorldMouse = new THREE.Vector3();
const _scratchLocalMouse = new THREE.Vector3();

const vertexShader = `
uniform float uTime;
uniform float uMorphProgress;
uniform vec3 uColorDark;
uniform vec3 uColorLight;
uniform vec3 uColorOverclock;
uniform float uIsDark;
uniform float uOverclock;
uniform float uAudioReact;

// 3D Graviton & Shockwave Uniforms
uniform vec3 uMousePos3D;
uniform float uMouseActive;
uniform vec3 uShockwavePos;
uniform float uShockwaveTime;

attribute vec3 pos0; // 3D Cosmic Cloud (Lvl 1)
attribute vec3 pos1; // 3D Hex Matrix & Shield (Lvl 2)
attribute vec3 pos2; // 3D Double Helix & Stream (Lvl 3 & 4)
attribute vec3 pos3; // 3D Quantum Core Sphere & Ring (Lvl 5)
attribute float aSize;  // Particle size variance
attribute float aSpeed; // Individual orbital speed

varying vec3 vColor;
varying float vAlpha;

void main() {
  float stage = clamp(uMorphProgress, 0.0, 3.0);
  
  // 1. Volumetric 3D morphing between geometric states
  vec3 currentPos;
  if (stage < 1.0) {
    currentPos = mix(pos0, pos1, smoothstep(0.0, 1.0, stage));
  } else if (stage < 2.0) {
    currentPos = mix(pos1, pos2, smoothstep(0.0, 1.0, stage - 1.0));
  } else {
    currentPos = mix(pos2, pos3, smoothstep(0.0, 1.0, stage - 2.0));
  }
  
  // 2. Smooth, continuous 3D orbital evolution (NO disco jitter, NO in-out bouncing)
  // Particles evolve gracefully in true 3D orbital space
  float orbitAngle = uTime * (0.04 + aSpeed * 0.04) * mix(1.0, 2.2, uOverclock);
  float cosA = cos(orbitAngle);
  float sinA = sin(orbitAngle);
  
  // Circular 3D orbital flow
  vec3 evolvedPos = currentPos;
  evolvedPos.x = currentPos.x * cosA - currentPos.z * sinA;
  evolvedPos.z = currentPos.x * sinA + currentPos.z * cosA;
  
  // Gentle vertical wave drift
  evolvedPos.y += sin(uTime * 0.3 + aSpeed * 6.28) * 0.4;

  // 3. Subtle audio bass reactivity (controlled, smooth pulse)
  float audioExpansion = uAudioReact * 3.0 * (1.0 + uOverclock * 0.5);
  evolvedPos += normalize(evolvedPos + vec3(0.0001)) * audioExpansion;

  // 4. Pure signature color: Plasma Cyan (#00f0ff) in dark mode, Ocean Blue (#0284c7) in light mode
  vec3 baseColor = mix(uColorLight, uColorDark, uIsDark);
  baseColor = mix(baseColor, uColorOverclock, uOverclock);

  // 5. Gravitational mouse interaction (smooth, elegant 3D space warp)
  if (uMouseActive > 0.5) {
    vec3 toMouse = evolvedPos - uMousePos3D;
    float distToMouse = length(toMouse);
    float mouseRadius = 24.0;
    
    if (distToMouse < mouseRadius) {
      float normDist = distToMouse / mouseRadius;
      float force = (1.0 - normDist) * (1.0 - normDist);
      vec3 repelDir = normalize(toMouse + vec3(0.0001));
      vec3 swirlDir = vec3(-repelDir.y, repelDir.x, repelDir.z * 0.2);
      
      evolvedPos += (repelDir * 7.0 + swirlDir * 3.0) * force;
      
      if (uIsDark > 0.5) {
        baseColor = mix(baseColor, vec3(1.0, 1.0, 1.0), force * 0.7);
      }
    }
  }

  // 6. Click Shockwave Wavefront
  if (uShockwaveTime > 0.0 && uShockwaveTime < 1.0) {
    float waveDist = length(evolvedPos - uShockwavePos);
    float waveRadius = sin(uShockwaveTime * 1.5707963) * 60.0;
    float waveWidth = 14.0;
    float distDelta = abs(waveDist - waveRadius);
    
    if (distDelta < waveWidth) {
      float waveNorm = 1.0 - (distDelta / waveWidth);
      float waveFade = 1.0 - uShockwaveTime;
      float ripple = sin(waveNorm * 3.1415926) * waveNorm * waveFade;
      vec3 pushDir = normalize(evolvedPos - uShockwavePos + vec3(0.0001));
      
      evolvedPos += pushDir * ripple * 14.0;
      
      if (uIsDark > 0.5) {
        baseColor = mix(baseColor, vec3(1.0, 1.0, 1.0), ripple * 0.9);
      }
    }
  }

  vec4 mvPosition = modelViewMatrix * vec4(evolvedPos, 1.0);
  
  // 7. STEADY, SMOOTH POINT SIZE (Physical depth perspective only - NO disco size strobing!)
  float pSize = (280.0 / -mvPosition.z) * aSize;
  gl_PointSize = clamp(pSize, 2.5, 14.0);
  
  gl_Position = projectionMatrix * mvPosition;
  
  // 8. Depth shading: atmospheric depth falloff
  float depth = smoothstep(5.0, -50.0, mvPosition.z);
  
  if (uIsDark > 0.5) {
    vColor = mix(baseColor * 0.4, baseColor, depth);
    vAlpha = depth * 0.85 + 0.15;
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
  float dist = length(xy);
  if (dist > 0.5) discard;
  
  // Crisp brilliant quantum core + soft neon glow
  float core = smoothstep(0.18, 0.0, dist) * 0.8;
  float glow = smoothstep(0.5, 0.0, dist);
  
  if (uIsDark > 0.5) {
    // Pure Plasma Cyan with brilliant white core
    vec3 finalColor = vColor + vec3(core);
    gl_FragColor = vec4(finalColor, glow * vAlpha);
  } else {
    // Crisp Ocean Blue in Light Mode
    float alpha = smoothstep(0.5, 0.05, dist) * vAlpha;
    gl_FragColor = vec4(vColor, alpha);
  }
}
`;

export default function NanobotSwarm({ 
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
    localPos: new THREE.Vector3(0, 0, 0)
  });
  
  const smoothMouseLocal = useRef(new THREE.Vector3(0, 0, 0));

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMorphProgress: { value: 0 },
    uIsDark: { value: 1.0 },
    uOverclock: { value: 0.0 },
    uAudioReact: { value: 0.0 },
    uColorDark: { value: new THREE.Color('#00f0ff') },       // Pure Original Plasma Cyan
    uColorLight: { value: new THREE.Color('#0284c7') },      // Ocean Cyan / Sky Blue
    uColorOverclock: { value: new THREE.Color('#ff0055') },  // Turbo Neon Red
    uMousePos3D: { value: new THREE.Vector3(0, 0, 0) },
    uMouseActive: { value: 0.0 },
    uShockwavePos: { value: new THREE.Vector3(0, 0, 0) },
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
    const pos0 = new Float32Array(PARTICLE_COUNT * 3);
    const pos1 = new Float32Array(PARTICLE_COUNT * 3);
    const pos2 = new Float32Array(PARTICLE_COUNT * 3);
    const pos3 = new Float32Array(PARTICLE_COUNT * 3);
    const aSize = new Float32Array(PARTICLE_COUNT);
    const aSpeed = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      aSize[i] = 0.7 + Math.random() * 0.6;
      aSpeed[i] = 0.5 + Math.random() * 0.8;

      // 1. State 0 (Level 1): Volumetric 3D Quantum Cloud (Centered at 0, 0, 0)
      const r0 = 32.0 * Math.cbrt(Math.random());
      const theta0 = Math.random() * 2.0 * Math.PI;
      const phi0 = Math.acos(2.0 * Math.random() - 1.0);
      pos0[i * 3]     = r0 * Math.sin(phi0) * Math.cos(theta0);
      pos0[i * 3 + 1] = r0 * Math.sin(phi0) * Math.sin(theta0);
      pos0[i * 3 + 2] = r0 * Math.cos(phi0);

      // 2. State 1 (Level 2): 3D Hex Matrix & Shield Volume (Centered at 0, 0, 0)
      const r1 = 30.0 * Math.sqrt(Math.random());
      const angle1 = Math.random() * 2.0 * Math.PI;
      pos1[i * 3]     = r1 * Math.cos(angle1);
      pos1[i * 3 + 1] = r1 * Math.sin(angle1) * 0.85;
      pos1[i * 3 + 2] = (Math.random() - 0.5) * 18.0;

      // 3. State 2 (Level 3 & 4): 3D Double Helix & Stream (Centered at 0, 0, 0)
      const t = (i / PARTICLE_COUNT) * Math.PI * 8.0;
      const strand = (i % 2 === 0) ? 1.0 : -1.0;
      const helixRadius = 18.0 + (Math.random() - 0.5) * 4.0;
      pos2[i * 3]     = Math.cos(t + (strand === 1.0 ? 0.0 : Math.PI)) * helixRadius + (Math.random() - 0.5) * 3.0;
      pos2[i * 3 + 1] = ((i / PARTICLE_COUNT) - 0.5) * 46.0 + (Math.random() - 0.5) * 3.0;
      pos2[i * 3 + 2] = Math.sin(t + (strand === 1.0 ? 0.0 : Math.PI)) * helixRadius + (Math.random() - 0.5) * 3.0;

      // 4. State 3 (Level 5): 3D Quantum Core Sphere with Orbiting Equatorial Ring (Centered at 0, 0, 0)
      if (i < PARTICLE_COUNT * 0.65) {
        const r3 = 20.0 * Math.cbrt(Math.random());
        const theta3 = Math.random() * 2.0 * Math.PI;
        const phi3 = Math.acos(2.0 * Math.random() - 1.0);
        pos3[i * 3]     = r3 * Math.sin(phi3) * Math.cos(theta3);
        pos3[i * 3 + 1] = r3 * Math.sin(phi3) * Math.sin(theta3);
        pos3[i * 3 + 2] = r3 * Math.cos(phi3);
      } else {
        const ringRadius = 24.0 + Math.random() * 8.0;
        const ringAngle = Math.random() * 2.0 * Math.PI;
        pos3[i * 3]     = Math.cos(ringAngle) * ringRadius;
        pos3[i * 3 + 1] = (Math.random() - 0.5) * 3.0;
        pos3[i * 3 + 2] = Math.sin(ringAngle) * ringRadius;
      }
    }

    return { pos0, pos1, pos2, pos3, aSize, aSpeed };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current || !pointsRef.current.material) return;
    
    // 1. Unproject mouse coordinates into 3D world space, then to local space
    _scratchVec.set(windowMouseNorm.current.x, windowMouseNorm.current.y, 0.5);
    _scratchVec.unproject(state.camera);
    _scratchDir.copy(_scratchVec).sub(state.camera.position).normalize();
    
    // Target plane at center of points group (z = -16)
    const targetZ = -16;
    const distToPlane = (targetZ - state.camera.position.z) / (_scratchDir.z || 0.0001);
    _scratchWorldMouse.copy(state.camera.position).add(_scratchDir.multiplyScalar(distToPlane));

    _scratchLocalMouse.copy(_scratchWorldMouse);
    pointsRef.current.worldToLocal(_scratchLocalMouse);
    smoothMouseLocal.current.lerp(_scratchLocalMouse, 0.18);

    // 2. Local scroll progress
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;

    // Smooth responsive morphing (0.12)
    currentProgress.current = THREE.MathUtils.lerp(
      currentProgress.current,
      scrollProgress * 3.0,
      0.12
    );

    // Shockwave progression
    if (shockwaveRef.current.active) {
      shockwaveRef.current.time += 0.016 * 0.85;
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
    
    // Smooth audio reactivity integration
    const rawAudio = terminalSound.getFrequencyData() || 0;
    matUniforms.uAudioReact.value = THREE.MathUtils.lerp(
      matUniforms.uAudioReact.value,
      rawAudio,
      0.2
    );
    
    // Smooth 3D rotation centered on the swarm itself
    const rotSpeed = isOverclocked ? 0.08 : 0.03;
    pointsRef.current.rotation.x = state.clock.elapsedTime * rotSpeed + windowMouseNorm.current.y * 0.1;
    pointsRef.current.rotation.y = state.clock.elapsedTime * (rotSpeed * 1.5) + windowMouseNorm.current.x * 0.1;
  });

  return (
    <points ref={pointsRef} position={[0, 0, -16]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={geometryData.pos0} itemSize={3} />
        <bufferAttribute attach="attributes-pos0" count={PARTICLE_COUNT} array={geometryData.pos0} itemSize={3} />
        <bufferAttribute attach="attributes-pos1" count={PARTICLE_COUNT} array={geometryData.pos1} itemSize={3} />
        <bufferAttribute attach="attributes-pos2" count={PARTICLE_COUNT} array={geometryData.pos2} itemSize={3} />
        <bufferAttribute attach="attributes-pos3" count={PARTICLE_COUNT} array={geometryData.pos3} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" count={PARTICLE_COUNT} array={geometryData.aSize} itemSize={1} />
        <bufferAttribute attach="attributes-aSpeed" count={PARTICLE_COUNT} array={geometryData.aSpeed} itemSize={1} />
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


