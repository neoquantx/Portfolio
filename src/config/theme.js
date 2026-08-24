import * as THREE from 'three';

export const theme = {
  colors: {
    void: '#0a0a0f',
    glow: '#00f0ff',
    helix: '#a855f7',
    bond: '#22d3ee',
    energy: '#f97316',
    text: '#e2e8f0',
    muted: '#64748b'
  },
  threeColors: {
    void: new THREE.Color('#0a0a0f'),
    glow: new THREE.Color('#00f0ff'),
    helix: new THREE.Color('#a855f7'),
    bond: new THREE.Color('#22d3ee'),
    energy: new THREE.Color('#f97316'),
    text: new THREE.Color('#e2e8f0'),
    muted: new THREE.Color('#64748b')
  },
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1440
  },
  animation: {
    duration: 1.5,
    stagger: 0.1,
    ease: 'power3.out'
  },
  particles: {
    mobile: 500,
    tablet: 1000,
    desktop: 2000
  }
};
