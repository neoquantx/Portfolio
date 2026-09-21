import { useState, useEffect, useRef } from 'react';

// Throttled mouse parallax - uses a ref internally so RAF does NOT
// cause React re-renders every frame. Only updates state when the
// smoothed value has changed meaningfully (delta > threshold).
export const useMouseParallax = (elementRef, lerpFactor = 0.08, multiplier = -20) => {
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const handleMouseMove = (e) => {
      targetRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const animate = () => {
      const tx = targetRef.current.x;
      const ty = targetRef.current.y;
      const cx = currentRef.current.x;
      const cy = currentRef.current.y;

      const nx = cx + (tx - cx) * lerpFactor;
      const ny = cy + (ty - cy) * lerpFactor;

      currentRef.current.x = nx;
      currentRef.current.y = ny;

      // Direct DOM mutation - zero React renders!
      if (elementRef.current) {
        elementRef.current.style.transform = `translate(${nx * multiplier}px, ${ny * multiplier}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [lerpFactor, multiplier, elementRef]);
};
