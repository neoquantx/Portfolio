import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';
import { cn } from '../../lib/utils';

export const MagneticScatterText = ({
  text,
  className,
  // Extra classes for each letter (default paints plain black/white).
  letterClassName,
  trigger = true,
}) => {
  const controls = useAnimation();
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (trigger) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [trigger, controls]);

  useEffect(() => {
    if (isHovering) {
      controls.start('scatter');
    } else {
      controls.start('visible');
    }
  }, [isHovering, controls]);

  const letters = text.split('');

  // Deterministic random for consistent scattering based on index
  const getRandom = (index) => {
    const seed = index * 42;
    const x = Math.sin(seed) * 100; // -100 to 100
    const y = Math.cos(seed) * 100; // -100 to 100
    const rotate = Math.sin(seed * 2) * 180; // -180 to 180
    return { x, y, rotate };
  };

  return (
    <motion.div
      className={cn('flex flex-wrap justify-center cursor-default select-none', className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={() => setIsHovering(true)}
      onTouchEnd={() => setIsHovering(false)}
      onTouchCancel={() => setIsHovering(false)}
    >
      {letters.map((letter, index) => {
        const randoms = getRandom(index);
        return (
          <motion.span
            key={index}
            className={letterClassName || 'inline-block font-sans font-bold text-black dark:text-white'}
            initial="hidden"
            animate={controls}
            variants={{
              hidden: {
                x: randoms.x * 5,
                y: randoms.y * 5,
                rotate: randoms.rotate,
                opacity: 0,
                scale: 0.5,
              },
              visible: {
                x: 0,
                y: 0,
                rotate: 0,
                opacity: 1,
                scale: 1,
                transition: {
                  type: 'spring',
                  damping: 12,
                  stiffness: 80,
                  mass: 0.8,
                  delay: index * 0.02,
                },
              },
              scatter: {
                x: randoms.x * 0.5, // Slight scatter on hover
                y: randoms.y * 0.5,
                rotate: randoms.rotate * 0.2,
                scale: 1.1,
                transition: {
                  type: 'spring',
                  damping: 15,
                  stiffness: 200,
                },
              },
            }}
          >
            {letter === ' ' ? ' ' : letter}
          </motion.span>
        );
      })}
    </motion.div>
  );
};
