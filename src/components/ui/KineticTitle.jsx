import React from 'react';
import { motion } from 'framer-motion';

const KineticTitle = () => {
  const title = "HIMANSHU";
  const subtitle = "CREATIVE DEVELOPER & DESIGNER";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5,
      }
    }
  };

  const letterVariants = {
    hidden: { 
      y: 100, 
      opacity: 0,
      rotateX: -90,
      filter: "blur(10px)"
    },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 6,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror"
      }
    }
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(5px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1.5,
        delay: 1.5,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pointer-events-none select-none z-10">
      <motion.div
        variants={floatingVariants}
        animate="animate"
      >
        <motion.h1 
          className="text-[12vw] md:text-[8vw] font-bold text-[var(--nano-text)] tracking-tighter leading-none"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {title.split("").map((char, index) => (
            <motion.span 
              key={index} 
              className="inline-block origin-bottom drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]"
              variants={letterVariants}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>
      </motion.div>
      
      <motion.p
        variants={subtitleVariants}
        initial="hidden"
        animate="visible"
        className="mt-6 text-sm md:text-base font-light text-[var(--nano-muted)] tracking-[0.4em] uppercase"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {subtitle}
      </motion.p>
    </div>
  );
};

export default KineticTitle;
