import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { portfolioData } from '../../config/portfolio';
import { useTheme } from '../../context/ThemeContext';
import CircularGallery from './circular-gallery';

const RING_CATEGORIES = [
  { key: 'hackathons', label: 'Hackathons' },
  { key: 'certificates', label: 'Certificates' },
  { key: 'workshops', label: 'Workshops' },
  { key: 'beyond', label: 'Beyond the Syllabus' },
];

// Vault entries mapped onto the GalleryItem contract
// ({ common, binomial, photo: { url, text, pos, by } }).
const toGalleryItems = (entries) =>
  entries.map((t) => ({
    common: t.title,
    binomial: `${t.role} · ${t.date}`,
    photo: {
      url: t.certificate_url || null,
      text: `${t.title} certificate`,
      by: t.tags && t.tags.length > 0 ? t.tags.join(' · ') : t.role,
    },
  }));

export default function TrophyRingSection() {
  const { isDark } = useTheme();
  const [activeCat, setActiveCat] = useState('certificates');

  const itemsByCat = (key) =>
    portfolioData.hackathons.filter((h) => (h.category || 'hackathons') === key);
  const activeItems = toGalleryItems(itemsByCat(activeCat));

  return (
    <div className="w-full">
      {/* Tall scroll runway: the gallery sticks while the page travels. */}
      <div className="relative w-full" style={{ height: '400vh' }}>
        <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden pt-14 md:pt-16">
          {/* Hero stays in flow above the 3D stage — never over the cards. */}
          <div className="z-10 shrink-0 px-4 text-center">
            <p
              className={cn(
                'font-mono text-[11px] font-bold tracking-[0.3em] uppercase',
                isDark ? 'text-cyan-400' : 'text-sky-600',
              )}
            >
              [ TROPHY_RING ]
            </p>
            <h2 className="mt-1 text-2xl font-bold font-space text-text-primary md:text-3xl">
              Mission Logs
            </h2>
            <p className="mt-1 font-mono text-xs text-text-secondary">
              Scroll to rotate the gallery
            </p>

            {/* Category pills — same naming as the vault: hackathons,
                certificates, workshops, beyond the syllabus. */}
            <div
              className="mx-auto mt-3 flex w-fit max-w-full gap-1.5 overflow-x-auto custom-scrollbar scroll-px-3 px-3 py-1"
              role="tablist"
              aria-label="Mission categories"
            >
              {RING_CATEGORIES.map((cat) => {
                const count = itemsByCat(cat.key).length;
                if (count === 0) return null;
                const isActive = activeCat === cat.key;
                return (
                  <button
                    key={cat.key}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveCat(cat.key)}
                    data-hoverable="true"
                    className={cn(
                      'shrink-0 rounded-full px-2.5 sm:px-3.5 py-1.5 sm:py-2 font-mono text-[10px] sm:text-[11px] font-bold tracking-wider uppercase transition-colors min-h-[36px] sm:min-h-[40px] whitespace-nowrap',
                      isActive
                        ? 'bg-sky-600 text-white dark:bg-cyan-400 dark:text-slate-950 shadow-md'
                        : isDark
                          ? 'bg-white/5 text-slate-300 hover:text-white border border-white/10'
                          : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-300',
                    )}
                  >
                    {cat.label} · {count}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3D stage gets all remaining height — cards clear the hero. */}
          <div className="relative min-h-0 w-full flex-1 overflow-hidden">
            <CircularGallery key={activeCat} items={activeItems} />
          </div>
        </div>
      </div>
    </div>
  );
}
