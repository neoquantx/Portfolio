import React, { useState, useEffect, useRef } from 'react';
import { Trophy, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';

// Item contract (same as the original paste):
// { common, binomial, photo: { url, text, pos, by } }
// photo.url may be null when no credential file exists — the card then
// renders fallback art instead of an <img> so the entry is never dropped.
const CircularGallery = React.forwardRef(function CircularGallery(
  { items = [], className, radius = 440, autoRotateSpeed = 0.02, ...props },
  ref,
) {
  const { isDark } = useTheme();
  const [rotation, setRotation] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [offset, setOffset] = useState(0);
  const [paused, setPaused] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const animationFrameRef = useRef(null);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const pendingRef = useRef(false);
  const movedRef = useRef(false);
  const idleAtRef = useRef(0);
  const stageNodeRef = useRef(null);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const dragXRef = useRef(0);
  const wheelAtRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.('(max-width: 639px)');
    const update = () => setIsMobile(!!mq?.matches);
    update();
    mq?.addEventListener?.('change', update);
    return () => mq?.removeEventListener?.('change', update);
  }, []);
  const effectiveRadius = isMobile ? 250 : radius;
  const cardW = isMobile ? 220 : 300;
  const cardH = isMobile ? 300 : 400;

  // Scroll-based rotation: full page scroll maps to one full turn.
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
      setRotation(scrollProgress * 360);

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Auto-rotation when not scrolling (off for reduced-motion users).
  useEffect(() => {
    const prefersReduced =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const autoRotate = () => {
      if (!isMobile && !isScrolling && !prefersReduced && !paused && !draggingRef.current && performance.now() > idleAtRef.current) {
        setRotation((prev) => prev + autoRotateSpeed);
      }
      animationFrameRef.current = requestAnimationFrame(autoRotate);
    };

    animationFrameRef.current = requestAnimationFrame(autoRotate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isScrolling, autoRotateSpeed, paused, isMobile]);

  // Track slide, no clicks needed. Desktop: drag + horizontal trackpad swipe
  // rotate the ring. Mobile: one horizontal swipe pages one card. Vertical
  // always stays as page scroll through the sticky runway.
  useEffect(() => {
    const node = stageNodeRef.current;
    if (!node) return undefined;
    const onTouchMove = (e) => {
      if (draggingRef.current && e.cancelable) e.preventDefault();
    };
    const onWheel = (e) => {
      // Horizontal trackpad intent only — vertical stays as page scroll.
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) <= 2) return;
      if (e.cancelable) e.preventDefault();
      if (isMobile) {
        const now = performance.now();
        if (now - wheelAtRef.current < 700) return;
        wheelAtRef.current = now;
        setMobileIndex((i) => (i + (e.deltaX > 0 ? 1 : -1) + items.length) % items.length);
      } else {
        setOffset((prev) => prev + e.deltaX * 0.35);
      }
      idleAtRef.current = performance.now() + 3000;
    };
    node.addEventListener('touchmove', onTouchMove, { passive: false });
    node.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      node.removeEventListener('touchmove', onTouchMove);
      node.removeEventListener('wheel', onWheel);
    };
  }, [isMobile, items.length]);

  // Mobile auto-advance: page forward while idle, stop on any interaction.
  useEffect(() => {
    if (!isMobile || items.length === 0) return undefined;
    const t = setInterval(() => {
      if (!paused && !draggingRef.current && performance.now() > idleAtRef.current) {
        setMobileIndex((i) => (i + 1) % items.length);
      }
    }, 3500);
    return () => clearInterval(t);
  }, [isMobile, paused, items.length]);

  if (items.length === 0) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-xl border border-dashed p-8 font-mono text-xs',
          isDark ? 'border-slate-700 text-slate-400' : 'border-slate-300 text-slate-500',
          className,
        )}
      >
        No entries to display yet.
      </div>
    );
  }

  // Mobile gets a flat one-card slider. A 3D ring of ten wide cards cannot
  // fit a phone viewport without neighbours overlapping the front card —
  // exactly what the screenshots showed. Swipe/drag pages one card with a
  // live finger-follow; auto-advance resumes after 3s idle.
  if (isMobile) {
    const goM = (dir) => {
      setMobileIndex((i) => (i + dir + items.length) % items.length);
      idleAtRef.current = performance.now() + 3000;
    };
    const mDown = (e) => {
      draggingRef.current = true;
      movedRef.current = false;
      startXRef.current = e.clientX;
      dragXRef.current = 0;
      setDragX(0);
      try { e.currentTarget.setPointerCapture?.(e.pointerId); } catch {}
    };
    const mMove = (e) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - startXRef.current;
      dragXRef.current = dx;
      setDragX(dx);
      if (Math.abs(dx) > 8) movedRef.current = true;
    };
    const mUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      const dx = dragXRef.current;
      setDragX(0);
      idleAtRef.current = performance.now() + 3000;
      if (dx <= -60) goM(1);
      else if (dx >= 60) goM(-1);
    };
    const ctrlBtn = 'flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full border backdrop-blur-md transition-colors';
    const ctrlTheme = isDark
      ? 'border-cyan-500/40 bg-slate-950/70 text-cyan-300'
      : 'border-sky-500/40 bg-white/80 text-sky-700';
    return (
      <div
        ref={(node) => {
          stageNodeRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        role="region"
        aria-label="Gallery"
        className={cn('relative w-full h-full flex flex-col items-center overflow-hidden select-none', className)}
        {...props}
      >
        <div
          className="w-full flex-1 min-h-0 overflow-hidden cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'pan-y' }}
          onPointerDown={mDown}
          onPointerMove={mMove}
          onPointerUp={mUp}
          onPointerCancel={mUp}
        >
          <div
            className="flex h-full"
            style={{
              transform: `translateX(calc(${-mobileIndex * 100}% + ${dragX}px))`,
              transition: dragX === 0 ? 'transform 0.28s ease' : 'none',
            }}
          >
            {items.map((item, i) => (
              <div
                key={(item.photo.url || item.common) + '-' + i}
                role="group"
                aria-label={item.common}
                className="w-full h-full shrink-0 flex items-center justify-center px-8"
              >
                <div
                  className={cn(
                    'relative w-[min(72vw,300px)] h-[min(44vh,360px)] min-h-[260px] rounded-lg shadow-2xl overflow-hidden border backdrop-blur-lg',
                    isDark
                      ? 'border-cyan-500/30 bg-slate-950/80 shadow-[0_0_30px_rgba(0,240,255,0.15)]'
                      : 'border-sky-500/30 bg-white/90 shadow-[0_20px_40px_rgba(14,165,233,0.2)]',
                  )}
                >
                  {item.photo.url ? (
                    <img
                      src={item.photo.url}
                      alt={item.photo.text}
                      loading="lazy"
                      draggable={false}
                      className={cn(
                        'absolute inset-0 w-full h-full object-contain p-2',
                        isDark ? 'bg-slate-950' : 'bg-slate-100',
                      )}
                      style={{ objectPosition: item.photo.pos || 'center' }}
                    />
                  ) : (
                    <div
                      className={cn(
                        'absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-3 p-6 text-center',
                        isDark ? 'bg-slate-950' : 'bg-slate-100',
                      )}
                    >
                      <Trophy className={cn('w-10 h-10', isDark ? 'text-cyan-400' : 'text-sky-600')} />
                      <p className={cn('font-mono text-[11px] tracking-widest', isDark ? 'text-slate-400' : 'text-slate-500')}>
                        CREDENTIAL FILE PENDING
                      </p>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/80 to-transparent text-white">
                    <h2 className="text-lg font-bold leading-snug">{item.common}</h2>
                    <em className="block text-xs italic opacity-80">{item.binomial}</em>
                    <p className="text-[11px] mt-1 opacity-70">Issued by: {item.photo.by}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-1.5 px-2 pb-12 pt-1">
          <button type="button" onClick={() => goM(-1)} aria-label="Previous entry" data-hoverable="true" className={cn(ctrlBtn, ctrlTheme)}>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => setPaused((v) => !v)} aria-label={paused ? 'Resume rotation' : 'Pause rotation'} data-hoverable="true" className={cn(ctrlBtn, ctrlTheme)}>
            {paused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
          </button>
          <button type="button" onClick={() => goM(1)} aria-label="Next entry" data-hoverable="true" className={cn(ctrlBtn, ctrlTheme)}>
            <ChevronRight className="h-5 w-5" />
          </button>
          <span className={cn('ml-1 rounded-full border px-2.5 py-1.5 font-mono text-[10px] tracking-widest backdrop-blur-md whitespace-nowrap', isDark ? 'border-slate-700 bg-slate-950/70 text-slate-300' : 'border-slate-300 bg-white/80 text-slate-600')}>
            {paused ? 'Paused · ' : ''}{mobileIndex + 1} / {items.length}
          </span>
        </div>
      </div>
    );
  }

  const anglePerItem = 360 / items.length;
  const totalRotation = (rotation + offset) % 360;
  const frontIndex =
    items.length > 0
      ? ((Math.round(-totalRotation / anglePerItem) % items.length) + items.length) % items.length
      : 0;

  const step = (dir) => {
    setOffset((prev) => prev + dir * anglePerItem);
    idleAtRef.current = performance.now() + 3000;
  };

  const onPointerDown = (e) => {
    pendingRef.current = true;
    movedRef.current = false;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    lastXRef.current = e.clientX;
    // Mouse owns its gestures immediately; touch waits for direction lock
    // so vertical swipes keep scrolling the page.
    if (e.pointerType === 'mouse') {
      pendingRef.current = false;
      draggingRef.current = true;
      e.currentTarget.setPointerCapture?.(e.pointerId);
    }
  };
  const onPointerMove = (e) => {
    if (draggingRef.current) {
      const dx = e.clientX - lastXRef.current;
      lastXRef.current = e.clientX;
      if (Math.abs(e.clientX - startXRef.current) > 8) movedRef.current = true;
      setOffset((prev) => prev + dx * 0.35);
      idleAtRef.current = performance.now() + 2000;
      return;
    }
    if (pendingRef.current && e.pointerType !== 'mouse') {
      const dx = e.clientX - startXRef.current;
      const dy = e.clientY - startYRef.current;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 12) return;
      pendingRef.current = false;
      if (Math.abs(dx) > Math.abs(dy)) {
        draggingRef.current = true;
        movedRef.current = true;
        lastXRef.current = e.clientX;
        try { e.currentTarget.setPointerCapture?.(e.pointerId); } catch {}
      }
      // else: vertical gesture — released to the browser for page scroll
    }
  };
  const endDrag = () => {
    draggingRef.current = false;
    pendingRef.current = false;
    idleAtRef.current = performance.now() + 2000;
  };

  return (
    <div
      ref={(node) => {
        stageNodeRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      role="region"
      aria-label="Circular 3D Gallery"
      className={cn('relative w-full h-full flex items-center justify-center overflow-hidden select-none cursor-grab active:cursor-grabbing', className)}
      style={{ perspective: isMobile ? '1200px' : '2000px', touchAction: 'pan-y' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      {...props}
    >
      <div
        className="relative w-full h-full"
        style={{
          transform: `rotateY(${totalRotation}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {items.map((item, i) => {
          const itemAngle = i * anglePerItem;
          const relativeAngle = (itemAngle + totalRotation + 360) % 360;
          const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
          const opacity = Math.max(0.3, 1 - normalizedAngle / 180);

          return (
            <div
              key={(item.photo.url || item.common) + '-' + i}
              role="group"
              aria-label={item.common}
              className="absolute"
              style={{
                width: cardW,
                height: cardH,
                transform: `rotateY(${itemAngle}deg) translateZ(${effectiveRadius}px)`,
                left: '50%',
                top: '50%',
                marginLeft: -cardW / 2,
                marginTop: -cardH / 2,
                opacity,
                transition: 'opacity 0.3s linear',
                backfaceVisibility: 'hidden',
              }}
              onClick={() => {
                if (movedRef.current) {
                  movedRef.current = false;
                  return;
                }
                setPaused((v) => !v);
              }}
            >
              <div
                className={cn(
                  'relative w-full h-full rounded-lg shadow-2xl overflow-hidden group border backdrop-blur-lg',
                  isDark
                    ? 'border-cyan-500/30 bg-slate-950/80 shadow-[0_0_30px_rgba(0,240,255,0.15)]'
                    : 'border-sky-500/30 bg-white/90 shadow-[0_20px_40px_rgba(14,165,233,0.2)]',
                )}
              >
                {item.photo.url ? (
                  <img
                    src={item.photo.url}
                    alt={item.photo.text}
                    loading="lazy"
                    draggable={false}
                    className={cn(
                      'absolute inset-0 w-full h-full object-contain p-2',
                      isDark ? 'bg-slate-950' : 'bg-slate-100',
                    )}
                    style={{ objectPosition: item.photo.pos || 'center' }}
                  />
                ) : (
                  <div
                    className={cn(
                      'absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-3 p-6 text-center',
                      isDark ? 'bg-slate-950' : 'bg-slate-100',
                    )}
                  >
                    <Trophy className={cn('w-10 h-10', isDark ? 'text-cyan-400' : 'text-sky-600')} />
                    <p className={cn('font-mono text-[11px] tracking-widest', isDark ? 'text-slate-400' : 'text-slate-500')}>
                      CREDENTIAL FILE PENDING
                    </p>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 w-full p-3 sm:p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                  <h2 className="truncate text-base sm:text-xl font-bold">{item.common}</h2>
                  <em className="block truncate text-xs sm:text-sm italic opacity-80">{item.binomial}</em>
                  <p className="truncate text-[11px] sm:text-xs mt-1 sm:mt-2 opacity-70">Issued by: {item.photo.by}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls — stop on any card, step through them all */}
      <div className="pointer-events-none absolute inset-x-0 bottom-10 z-10 flex items-center justify-center gap-2 px-2">
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Previous entry"
            data-hoverable="true"
            className={cn(
              'flex min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] items-center justify-center rounded-full border backdrop-blur-md transition-colors',
              isDark
                ? 'border-cyan-500/40 bg-slate-950/70 text-cyan-300 hover:bg-slate-900'
                : 'border-sky-500/40 bg-white/80 text-sky-700 hover:bg-white',
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setPaused((v) => !v)}
            aria-label={paused ? 'Resume rotation' : 'Pause rotation'}
            data-hoverable="true"
            className={cn(
              'flex min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] items-center justify-center rounded-full border backdrop-blur-md transition-colors',
              isDark
                ? 'border-cyan-500/40 bg-slate-950/70 text-cyan-300 hover:bg-slate-900'
                : 'border-sky-500/40 bg-white/80 text-sky-700 hover:bg-white',
            )}
          >
            {paused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Next entry"
            data-hoverable="true"
            className={cn(
              'flex min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] items-center justify-center rounded-full border backdrop-blur-md transition-colors',
              isDark
                ? 'border-cyan-500/40 bg-slate-950/70 text-cyan-300 hover:bg-slate-900'
                : 'border-sky-500/40 bg-white/80 text-sky-700 hover:bg-white',
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <span
            className={cn(
              'ml-1 rounded-full border px-2.5 sm:px-3 py-1.5 sm:py-2 font-mono text-[10px] sm:text-[11px] tracking-widest backdrop-blur-md whitespace-nowrap',
              isDark
                ? 'border-slate-700 bg-slate-950/70 text-slate-300'
                : 'border-slate-300 bg-white/80 text-slate-600',
            )}
          >
            {paused ? 'Paused · ' : ''}{frontIndex + 1} / {items.length}
          </span>
        </div>
      </div>
    </div>
  );
});

CircularGallery.displayName = 'CircularGallery';

export default CircularGallery;
export { CircularGallery };
