import { useState, useEffect } from 'react';

const getZoomLevel = (p) => {
  if (p <= 0.2) return 1;
  if (p <= 0.4) return 2;
  if (p <= 0.6) return 3;
  if (p <= 0.8) return 4;
  return 5;
};

export function useScrollProgress() {
  const [level, setLevel] = useState(1);

  useEffect(() => {
    let ticking = false;
    let currentLvl = 1;

    // Defined level ranges with hysteresis buffer to prevent boundary thrashing
    const calcLevel = (p, current) => {
      // Boundaries at ~0.2, 0.4, 0.6, 0.8 with 0.02 hysteresis
      if (current === 1) {
        return p > 0.22 ? 2 : 1;
      } else if (current === 2) {
        if (p < 0.18) return 1;
        if (p > 0.42) return 3;
        return 2;
      } else if (current === 3) {
        if (p < 0.38) return 2;
        if (p > 0.62) return 4;
        return 3;
      } else if (current === 4) {
        if (p < 0.58) return 3;
        if (p > 0.82) return 5;
        return 4;
      } else {
        return p < 0.78 ? 4 : 5;
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          const p = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
          const nextLvl = calcLevel(p, currentLvl);
          
          if (nextLvl !== currentLvl) {
            currentLvl = nextLvl;
            setLevel(nextLvl);
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // init

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (level - 1) * 0.2 + 0.1;
}
