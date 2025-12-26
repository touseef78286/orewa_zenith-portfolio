
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';

const techIcons = [
  { name: 'React', color: '#61DAFB' },
  { name: 'Node', color: '#68A063' },
  { name: 'TS', color: '#3178C6' },
  { name: 'GLSL', color: '#BD00FF' },
  { name: 'Three', color: '#FFFFFF' }
];

const OrbitingIcon: React.FC<{ name: string; color: string; index: number; isZeroGravity: boolean }> = ({ name, color, index, isZeroGravity }) => {
  const angle = (index / techIcons.length) * Math.PI * 2;
  const radius = 240;
  
  // Magnet physics
  const xValue = useMotionValue(0);
  const yValue = useMotionValue(0);
  const springX = useSpring(xValue, { stiffness: 100, damping: 20 });
  const springY = useSpring(yValue, { stiffness: 100, damping: 20 });

  useEffect(() => {
    if (!isZeroGravity) return;
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const dist = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
      if (dist < 500) {
        const pull = (500 - dist) * 0.2;
        xValue.set((e.clientX - centerX) * 0.1);
        yValue.set((e.clientY - centerY) * 0.1);
      } else {
        xValue.set(0);
        yValue.set(0);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isZeroGravity]);

  return (
    <motion.div
      layout
      drag={isZeroGravity}
      dragConstraints={false}
      style={{ x: springX, y: springY }}
      animate={isZeroGravity ? {
        rotate: [0, 360],
        transition: { duration: 20 + index * 5, repeat: Infinity, ease: "linear" }
      } : { rotate: 0 }}
      className="absolute pointer-events-auto"
    >
      <motion.div
        animate={isZeroGravity ? {
            x: [radius * Math.cos(angle), radius * Math.cos(angle + 0.1), radius * Math.cos(angle)],
            y: [radius * Math.sin(angle), radius * Math.sin(angle + 0.2), radius * Math.sin(angle)],
            scale: [1, 1.1, 1],
            transition: { duration: 5 + index, repeat: Infinity, ease: "easeInOut" }
        } : { x: 0, y: 0, scale: 0, opacity: 0 }}
        className="glass p-3 rounded-xl border border-[var(--accent)]/20 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md"
      >
        <span className="font-mono text-[10px] uppercase tracking-tighter" style={{ color }}>{name}</span>
      </motion.div>
    </motion.div>
  );
};

export const Hero: React.FC<{ isZeroGravity?: boolean }> = ({ isZeroGravity = false }) => {
  const [displaySet, setDisplaySet] = useState({
    lines: ['OREWA_ZENITH'],
    id: 'zenith'
  });

  useEffect(() => {
    if (isZeroGravity) return;
    const interval = setInterval(() => {
      setDisplaySet(prev => 
        prev.id === 'zenith' 
          ? { lines: ['TOUSEEF', 'PANJTAN'], id: 'name' } 
          : { lines: ['OREWA_ZENITH'], id: 'zenith' }
      );
    }, 4500);
    return () => clearInterval(interval);
  }, [isZeroGravity]);

  const floatTransition = {
    x: { duration: 4, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" },
    y: { duration: 5, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" },
    rotate: { duration: 7, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }
  } as const;

  return (
    <section className="h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden relative">
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-center"
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {techIcons.map((tech, i) => (
            <OrbitingIcon key={tech.name} {...tech} index={i} isZeroGravity={isZeroGravity} />
          ))}
        </div>

        <div className="relative z-20">
          <motion.div layout className="font-mono text-[var(--accent)] mb-4 text-[9px] md:text-xs tracking-[0.7em] uppercase opacity-50 select-none">
            Creative Engineer & Tech Architect
          </motion.div>
          
          <div className="min-h-[40vh] flex flex-col items-center justify-center py-4">
              <AnimatePresence mode="wait">
                  <motion.div
                      key={displaySet.id}
                      className="flex flex-col items-center justify-center w-full"
                  >
                      {displaySet.lines.map((line, i) => (
                          <motion.h1
                              key={`${line}-${i}`}
                              layout
                              drag={isZeroGravity}
                              dragConstraints={false}
                              dragElastic={0.1}
                              initial={{ y: 20, opacity: 0, filter: 'blur(10px)' }}
                              animate={isZeroGravity ? {
                                x: [0, (i + 1) * 30, -30, 0],
                                y: [0, -40, 40, 0],
                                rotate: [0, 5, -5, 0],
                                scale: [1, 1.05, 1],
                                transition: { ...floatTransition, scale: { duration: 1, repeat: Infinity, repeatType: "mirror" } }
                              } : { 
                                y: 0, opacity: 1, filter: 'blur(0px)', x: 0, rotate: 0, scale: 1
                              }}
                              exit={{ y: -20, opacity: 0, filter: 'blur(10px)' }}
                              transition={{ 
                                  layout: { type: 'spring', stiffness: 100, damping: 15 },
                                  duration: 0.7, delay: i * 0.05 
                              }}
                              className="font-syne text-[clamp(2rem,7.5vw,5.5rem)] leading-[0.95] tracking-tighter uppercase whitespace-nowrap px-4 py-1 select-none cursor-pointer"
                          >
                              {line}
                          </motion.h1>
                      ))}
                  </motion.div>
              </AnimatePresence>
          </div>

          <motion.div 
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6"
          >
              <p className="max-w-xl mx-auto font-mono text-white/40 text-[9px] md:text-[10px] leading-relaxed uppercase tracking-widest px-6 select-none">
                  Pushing the boundaries of interaction design through 3D physics and kinetic motion. 
                  Blending engineering precision with artistic chaos.
              </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
