import React, { useRef, useId, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';
import { cn } from '../../lib/utils';

export default function LiquidButton({
  text = 'Hover me',
  children,
  className,
  backgroundColor = 'bg-black dark:bg-orange-400',
  textColor = 'text-white dark:text-neutral-50',
  isDripping = false,
  onClick,
  ...props
}) {
  const containerRef = useRef(null);
  const rawId = useId();
  const filterId = `liquid-goo-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const mouseX = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 320, damping: 22 });
  const [isHovered, setIsHovered] = useState(false);

  // Normalized cursor percentage (0% to 100%) for interactive follower droplet
  const cursorPercent = useMotionValue(50);
  const springCursorPercent = useSpring(cursorPercent, { stiffness: 280, damping: 24 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const centeredX = relativeX - rect.width / 2;
    mouseX.set(centeredX);

    // Keep interactive drop clamped inside 16% - 84% of button width
    const pct = Math.max(16, Math.min(84, (relativeX / rect.width) * 100));
    cursorPercent.set(pct);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
  };

  const handleTouchStart = (e) => {
    setIsHovered(true);
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = e.touches[0].clientX - rect.left;
    const centeredX = relativeX - rect.width / 2;
    mouseX.set(centeredX);
    const pct = Math.max(16, Math.min(84, (relativeX / rect.width) * 100));
    cursorPercent.set(pct);
  };

  const handleTouchMove = (e) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = e.touches[0].clientX - rect.left;
    const centeredX = relativeX - rect.width / 2;
    mouseX.set(centeredX);
    const pct = Math.max(16, Math.min(84, (relativeX / rect.width) * 100));
    cursorPercent.set(pct);
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
    mouseX.set(0);
  };

  const activeState = isDripping || isHovered ? 'hover' : 'initial';

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-flex items-center justify-center p-6 select-none', className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* High-definition SVG Gooey Filter with wide region to prevent clipping */}
      <svg className="absolute h-0 w-0 overflow-hidden" aria-hidden="true">
        <defs>
          <filter
            id={filterId}
            colorInterpolationFilters="sRGB"
            x="-30%"
            y="-20%"
            width="160%"
            height="380%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="5.5" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Button wrapper with snappy spring press interaction */}
      <motion.button
        type="button"
        onClick={onClick}
        className={cn(
          'group relative inline-flex cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2'
        )}
        whileHover={{ scale: 1.025 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 450, damping: 22 }}
        {...props}
      >
        {/* Liquid Body Layer (Processed through SVG Gooey Filter) */}
        <div
          className="relative z-10 w-full rounded-lg"
          style={{ filter: `url(#${filterId})` }}
        >
          {/* Main Solid Button Base with 3D liquid volume */}
          <div
            className={cn(
              'relative z-10 flex min-h-[46px] min-w-[144px] items-center justify-center rounded-lg px-7 py-2.5 transition-colors duration-200 overflow-hidden',
              'shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.7),inset_0_-2px_4px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.08)] dark:shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.85),inset_0_-2px_5px_rgba(0,0,0,0.25),0_6px_18px_rgba(0,0,0,0.5)]',
              backgroundColor
            )}
          >
            {/* Invisible layout spacer so the button base conforms precisely to content dimensions */}
            <span className="invisible select-none flex items-center justify-center gap-2 text-sm font-semibold tracking-wide md:text-base whitespace-nowrap">
              {children || text}
            </span>

            {/* Glossy Liquid Specular Sheen (Curved meniscus highlight) */}
            <div className="pointer-events-none absolute inset-x-3 top-0.5 h-[38%] rounded-t-full bg-gradient-to-b from-white/35 via-white/10 to-transparent dark:from-white/45 dark:via-white/15" />
          </div>

          {/* Curated Snappy Liquid Droplets */}
          <LiquidDrop
            left="16%"
            size="w-3.5 h-3.5 md:w-4 md:h-4"
            delay={0.05}
            duration={1.25}
            mouseX={springX}
            backgroundColor={backgroundColor}
            activeState={activeState}
          />
          <LiquidDrop
            left="35%"
            size="w-4.5 h-4.5 md:w-5 md:h-5"
            delay={0.45}
            duration={1.4}
            mouseX={springX}
            backgroundColor={backgroundColor}
            activeState={activeState}
          />
          <LiquidDrop
            left="65%"
            size="w-3 h-3 md:w-3.5 md:h-3.5"
            delay={0.85}
            duration={1.15}
            mouseX={springX}
            backgroundColor={backgroundColor}
            activeState={activeState}
          />
          <LiquidDrop
            left="84%"
            size="w-4 h-4 md:w-4.5 md:h-4.5"
            delay={0.2}
            duration={1.35}
            mouseX={springX}
            backgroundColor={backgroundColor}
            activeState={activeState}
          />

          {/* Interactive Cursor Follower Droplet */}
          <CursorFollowerDrop
            cursorPercent={springCursorPercent}
            backgroundColor={backgroundColor}
            activeState={activeState}
          />
        </div>

        {/* Crisp Unfiltered Foreground Content (Centered over button, never blurred by SVG filter) */}
        <span
          className={cn(
            'pointer-events-none absolute inset-0 z-20 flex items-center justify-center gap-2 px-7 py-2.5 text-sm font-semibold tracking-wide transition-colors md:text-base select-none whitespace-nowrap',
            textColor
          )}
        >
          {children || text}
        </span>
      </motion.button>
    </div>
  );
}

// ─── Snappy Liquid Droplet with Fluid Surface Tension Physics ─────────────────
function LiquidDrop({
  left,
  size,
  delay,
  duration,
  mouseX,
  backgroundColor,
  activeState,
}) {
  const factor = duration * 4.5;
  const x = useTransform(mouseX, [-150, 150], [-factor, factor]);

  return (
    <motion.div
      className={cn(
        'absolute bottom-1 -z-10 rounded-lg will-change-transform pointer-events-none',
        size,
        backgroundColor
      )}
      style={{ left, x }}
      initial="initial"
      animate={activeState}
      variants={{
        initial: {
          y: 0,
          scale: 0,
          opacity: 0,
          transition: { duration: 0.2, ease: 'easeOut' },
        },
        hover: {
          y: [0, 5, 18, 32, 60, 85],
          scale: [0, 1.15, 1, 1, 0.85, 0],
          scaleX: [0.8, 1.45, 0.65, 1.18, 0.92, 0.55],
          scaleY: [0.8, 0.68, 1.65, 0.92, 1.08, 0.55],
          opacity: [0, 1, 1, 1, 0.85, 0],
          transition: {
            duration,
            repeat: Infinity,
            ease: ['easeOut', 'easeInOut', 'easeIn', 'easeIn', 'easeIn'],
            times: [0, 0.22, 0.48, 0.6, 0.82, 1],
            delay,
          },
        },
      }}
    />
  );
}

// ─── Interactive Cursor Droplet ──────────────────────────────────────────────
function CursorFollowerDrop({
  cursorPercent,
  backgroundColor,
  activeState,
}) {
  const leftStyle = useTransform(cursorPercent, (p) => `${p}%`);

  return (
    <motion.div
      className={cn(
        'absolute bottom-1 -z-10 h-4.5 w-4.5 rounded-lg will-change-transform pointer-events-none md:h-5 md:w-5',
        backgroundColor
      )}
      style={{ left: leftStyle }}
      initial="initial"
      animate={activeState}
      variants={{
        initial: {
          y: 0,
          scale: 0,
          opacity: 0,
          transition: { duration: 0.2 },
        },
        hover: {
          y: [0, 5, 18, 32, 58, 82],
          scale: [0, 1.15, 1, 1, 0.85, 0],
          scaleX: [0.8, 1.45, 0.65, 1.18, 0.92, 0.55],
          scaleY: [0.8, 0.68, 1.65, 0.92, 1.08, 0.55],
          opacity: [0, 1, 1, 1, 0.85, 0],
          transition: {
            duration: 1.25,
            repeat: Infinity,
            ease: ['easeOut', 'easeInOut', 'easeIn', 'easeIn', 'easeIn'],
            times: [0, 0.22, 0.48, 0.6, 0.82, 1],
            delay: 0.1,
          },
        },
      }}
    />
  );
}
