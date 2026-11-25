import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Tracks which portfolio section (1-5) sits in the middle of the viewport.
 * The page scrolls natively — every section is real document flow — so there
 * is no fake scroll height, no hysteresis, and no scroll fighting. The 3D
 * scene reads raw window.scrollY itself and needs nothing from here.
 */
export function useActiveSection(count = 5) {
  const [active, setActive] = useState(1);
  const refs = useRef([]);

  const sectionRef = useCallback(
    (index) => (el) => {
      refs.current[index] = el;
    },
    []
  );

  useEffect(() => {
    const els = refs.current.filter(Boolean);
    if (els.length === 0 || !('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const lvl = Number(entry.target.getAttribute('data-level'));
            if (lvl >= 1 && lvl <= count) setActive(lvl);
          }
        }
      },
      // Only the section crossing the viewport middle band counts.
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [count]);

  return { active, sectionRef };
}

/** Travel to a section with native smooth scrolling. */
export function scrollToLevel(level) {
  try {
    const clamped = Math.min(5, Math.max(1, level));
    document
      .querySelector(`[data-level="${clamped}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch {}
}
