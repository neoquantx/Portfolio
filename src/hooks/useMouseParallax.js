import { useState, useEffect } from 'react';
import { lerp } from '../utils/math';

export const useMouseParallax = (lerpFactor = 0.1) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [targetMouse, setTargetMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize to -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setTargetMouse({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let animationFrameId;
    
    const animate = () => {
      setMouse((prevMouse) => ({
        x: lerp(prevMouse.x, targetMouse.x, lerpFactor),
        y: lerp(prevMouse.y, targetMouse.y, lerpFactor),
      }));
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetMouse, lerpFactor]);

  return mouse;
};
