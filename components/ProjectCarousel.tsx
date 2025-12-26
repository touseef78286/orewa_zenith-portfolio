
import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';

const projects = [
  {
    title: "Quantum Flux",
    tag: "3D Experiment",
    img: "https://picsum.photos/800/600?random=1",
    desc: "Physics driven particle system exploring entropy and flow."
  },
  {
    title: "Zenith Core",
    tag: "E-Commerce",
    img: "https://picsum.photos/800/600?random=2",
    desc: "Ultra-high performance shopping experience for high-end gear."
  },
  {
    title: "Obsidian UI",
    tag: "Design System",
    img: "https://picsum.photos/800/600?random=3",
    desc: "The architecture behind the dark aesthetic of the future."
  }
];

export const ProjectCarousel: React.FC<{ isZeroGravity?: boolean; onProjectDrop?: (p: any) => void }> = ({ isZeroGravity, onProjectDrop }) => {
  const [index, setIndex] = useState(0);
  const dragX = useMotionValue(0);

  const onDragEnd = (event: any, info: any, proj: any) => {
    if (isZeroGravity) {
        // Check for intersection with center portal
        const dropX = info.point.x;
        const dropY = info.point.y;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const dist = Math.sqrt(Math.pow(dropX - centerX, 2) + Math.pow(dropY - centerY, 2));
        
        if (dist < 150) {
            onProjectDrop?.(proj);
        }
        return;
    };
    
    const x = dragX.get();
    if (x <= -100) {
      setIndex((prev) => (prev + 1) % projects.length);
    } else if (x >= 100) {
      setIndex((prev) => (prev - 1 + projects.length) % projects.length);
    }
    dragX.set(0);
  };

  return (
    <div className={`relative h-[500px] flex items-center justify-center perspective-[1000px] ${isZeroGravity ? '' : 'cursor-grab active:cursor-grabbing'}`}>
      <div className="absolute top-0 right-0 font-mono text-xs opacity-30 select-none">
        {isZeroGravity ? 'PORTAL_READY: DROP_TO_DECODE' : 'DRAG TO NAVIGATE'}
      </div>
      
      <AnimatePresence mode='popLayout'>
        {projects.map((proj, i) => {
          const isActive = i === index;
          const isNext = (i === (index + 1) % projects.length);
          const isPrev = (i === (index - 1 + projects.length) % projects.length);

          if (!isActive && !isNext && !isPrev) return null;

          return (
            <motion.div
              key={proj.title}
              layout
              drag={isZeroGravity || isActive}
              dragConstraints={isZeroGravity ? false : { left: 0, right: 0 }}
              style={{ x: (isActive && !isZeroGravity) ? dragX : 0 }}
              onDragEnd={(e, info) => onDragEnd(e, info, proj)}
              initial={{ scale: 0.8, opacity: 0, rotateY: 45, x: 200 }}
              animate={isZeroGravity ? {
                scale: 0.9,
                opacity: 0.7,
                x: [Math.random() * 50 - 25, Math.random() * 50 - 25],
                y: [Math.random() * 50 - 25, Math.random() * 50 - 25],
                rotate: [Math.random() * 5 - 2.5, Math.random() * 5 - 2.5],
                transition: { duration: 5, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }
              } : {
                scale: isActive ? 1 : 0.8,
                opacity: isActive ? 1 : 0.3,
                rotateY: isActive ? 0 : (isNext ? -45 : 45),
                x: isActive ? 0 : (isNext ? 300 : -300),
                rotate: 0,
                y: 0,
                zIndex: isActive ? 10 : 5
              }}
              transition={{
                layout: { type: 'spring', stiffness: 100, damping: 12 },
                type: 'spring',
                stiffness: 100,
                damping: 20
              }}
              className="absolute w-full max-w-2xl aspect-video rounded-3xl overflow-hidden glass border border-white/10 select-none"
            >
              <img src={proj.img} alt={proj.title} className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent p-8 flex flex-col justify-end pointer-events-none">
                <span className="text-[var(--accent)] font-mono text-xs tracking-widest mb-2">{proj.tag}</span>
                <h3 className="font-syne text-4xl mb-4 uppercase">{proj.title}</h3>
                <p className="font-mono text-sm opacity-60 max-w-md">{proj.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
