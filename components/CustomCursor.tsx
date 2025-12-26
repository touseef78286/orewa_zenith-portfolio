
import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

export const CustomCursor: React.FC<{ isZeroGravity: boolean; isTrailActive?: boolean }> = ({ isZeroGravity, isTrailActive }) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [trail, setTrail] = useState<{ x: number, y: number, id: number }[]>([]);
  const trailIdCounter = useRef(0);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { stiffness: 1200, damping: 60, mass: 0.5 };
  const auraConfig = { stiffness: 600, damping: 40, mass: 0.8 };

  const dotX = useSpring(cursorX, springConfig);
  const dotY = useSpring(cursorY, springConfig);
  
  const auraX = useSpring(cursorX, auraConfig);
  const auraY = useSpring(cursorY, auraConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      cursorX.set(x);
      cursorY.set(y);

      if (isTrailActive) {
        setTrail(prev => {
          const newTrail = [...prev, { x, y, id: trailIdCounter.current++ }];
          if (newTrail.length > 12) newTrail.shift();
          return newTrail;
        });
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHoverable = 
        target.tagName.toLowerCase() === 'button' || 
        target.tagName.toLowerCase() === 'a' || 
        target.closest('.cursor-pointer') ||
        target.closest('button') ||
        target.closest('a');
      setHovered(!!isHoverable);
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorX, cursorY, isTrailActive]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
      {/* Neon Trail */}
      <AnimatePresence>
        {isTrailActive && trail.map((point, i) => (
            <motion.div
                key={point.id}
                initial={{ opacity: 0.6, scale: 1 }}
                animate={{ opacity: 0, scale: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                    position: 'absolute',
                    left: point.x,
                    top: point.y,
                    x: '-50%',
                    y: '-50%',
                    width: '8px',
                    height: '8px',
                    background: 'var(--accent)',
                    borderRadius: '50%',
                    boxShadow: '0 0 10px var(--accent)',
                    filter: 'blur(1px)'
                }}
            />
        ))}
      </AnimatePresence>

      <motion.div
        style={{
          translateX: dotX,
          translateY: dotY,
          x: '-50%',
          y: '-50%',
        }}
        className="absolute w-1.5 h-1.5 bg-[var(--accent)] rounded-full shadow-[0_0_15px_var(--accent)]"
      />

      <motion.div
        animate={{
          scale: clicked ? 0.7 : hovered ? 2.2 : 1,
          borderWidth: hovered ? '1px' : '1.5px',
          borderColor: hovered ? 'var(--accent)' : 'rgba(255, 255, 255, 0.25)',
          backgroundColor: hovered ? 'var(--accent-glow)' : 'transparent',
        }}
        style={{
          translateX: auraX,
          translateY: auraY,
          x: '-50%',
          y: '-50%',
        }}
        transition={{ type: 'spring', stiffness: 800, damping: 35, mass: 0.5 }}
        className="absolute w-10 h-10 rounded-full border border-white/20 backdrop-blur-[1px]"
      />
    </div>
  );
};
