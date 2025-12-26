
import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { Github, Code2, Cpu, Globe, Zap, Layers } from 'lucide-react';

const MagneticCard: React.FC<{ children: React.ReactNode, className?: string, isZeroGravity?: boolean, techData?: string[], label?: string }> = ({ children, className = "", isZeroGravity, techData, label }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 100, damping: 15 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  // Swarm effect in Zero-G
  useEffect(() => {
    if (!isZeroGravity) return;
    const handleMouseMove = (e: MouseEvent) => {
        if (isExpanded) return;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const distance = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
        if (distance < 600) {
            const pullX = (e.clientX - centerX) * 0.05;
            const pullY = (e.clientY - centerY) * 0.05;
            x.set(pullX);
            y.set(pullY);
        }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isZeroGravity, isExpanded]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || isZeroGravity) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    const limit = 40;
    x.set(Math.max(Math.min(distanceX * 0.1, limit), -limit));
    y.set(Math.max(Math.min(distanceY * 0.1, limit), -limit));
  };

  const handleMouseLeave = () => {
    if (!isZeroGravity) {
        x.set(0); y.set(0);
    }
  };

  return (
    <>
      <motion.div
        ref={ref}
        layout
        drag={isZeroGravity && !isExpanded}
        dragConstraints={false}
        dragElastic={0.6}
        dragMomentum={true}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onDoubleClick={() => isZeroGravity && setIsExpanded(true)}
        style={{
          x: mouseX,
          y: mouseY,
          zIndex: isExpanded ? 300 : 'auto'
        }}
        animate={isZeroGravity && !isExpanded ? {
          y: [0, Math.random() * 80 - 40, Math.random() * 80 - 40, 0],
          rotate: [0, Math.random() * 20 - 10, Math.random() * 20 - 10, 0],
          scale: [1, 1.05, 1],
          opacity: 0.6,
          transition: { duration: 8 + Math.random() * 4, repeat: Infinity, ease: "easeInOut" }
        } : isExpanded ? {
            x: '50vw', y: '50vh', scale: 1.2, rotate: 0, opacity: 1
        } : { rotate: 0, opacity: 1, scale: 1 }}
        className={`rounded-3xl p-6 relative overflow-hidden group border transition-all duration-1000 select-none ${className} ${isExpanded ? 'fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[350px] glass border-[var(--accent)]/50' : 'glass border-white/5 hover:border-[var(--accent)]/30'}`}
      >
          {isZeroGravity && (
              <div className="absolute top-2 left-4 font-mono text-[7px] text-[var(--accent)] opacity-40 uppercase tracking-widest">
                ID: {label || 'OBJ_442'} / PHYSICS: AT_ZERO
              </div>
          )}
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 blur-3xl rounded-full group-hover:bg-[var(--accent)]/10 transition-colors pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {isExpanded ? (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                    className="h-full flex flex-col justify-between pt-4"
                >
                    <div className="font-mono text-[10px] text-[var(--accent)] space-y-2 uppercase">
                        <p className="text-white/60 mb-4 font-syne text-lg">TECHNICAL_ARCH</p>
                        {techData?.map((line, i) => <p key={i}> {line}</p>)}
                        <p className="mt-8 text-white/20 italic">"The invisible logic that powers the visual noise."</p>
                    </div>
                    <button onClick={() => setIsExpanded(false)} className="text-[var(--accent)] hover:text-white text-[9px] font-mono tracking-widest uppercase">DISMISS_NODE</button>
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
                    {children}
                </motion.div>
            )}
          </AnimatePresence>
      </motion.div>
      {isExpanded && <div className="fixed inset-0 z-[250] bg-[#050505]/95 backdrop-blur-3xl" onDoubleClick={() => setIsExpanded(false)} />}
    </>
  );
};

export const BentoGrid: React.FC<{ isZeroGravity?: boolean }> = ({ isZeroGravity }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 grid-rows-2 gap-4 h-full md:h-[600px]">
      <MagneticCard label="GIT_NOD" techData={["CONTRIB_GRAPH: HIGH", "COMMIT_HASH: 0x44A", "REPO_VIS: PUB"]} isZeroGravity={isZeroGravity} className="md:col-span-2 lg:col-span-2 row-span-1 flex flex-col justify-between">
        <div className="flex justify-between items-start">
            <Github className="text-[var(--accent)] w-8 h-8" />
            <span className="font-mono text-xs opacity-50 uppercase tracking-widest">Git_Matrix</span>
        </div>
        <div>
            <h3 className="font-syne text-2xl mb-1">2.4k+ Contributions</h3>
            <p className="font-mono text-xs opacity-40 uppercase tracking-tight">Yearly cycle of creation.</p>
        </div>
      </MagneticCard>

      <MagneticCard label="STK_NOD" techData={["REACT_19", "THREE_JS_0.182", "FM_12.2"]} isZeroGravity={isZeroGravity} className="md:col-span-2 lg:col-span-4 row-span-1 flex flex-col justify-center">
        <div className="grid grid-cols-3 gap-8">
            <div className="flex flex-col gap-2"><Code2 className="text-[var(--accent)] w-5 h-5" /><span className="font-mono text-xs opacity-80 italic text-nowrap">React Ecosystem</span></div>
            <div className="flex flex-col gap-2"><Layers className="text-[var(--accent)] w-5 h-5" /><span className="font-mono text-xs opacity-80 italic text-nowrap">WebGL Shaders</span></div>
            <div className="flex flex-col gap-2"><Cpu className="text-[var(--accent)] w-5 h-5" /><span className="font-mono text-xs opacity-80 italic text-nowrap">Kinetic Motion</span></div>
        </div>
      </MagneticCard>

      <MagneticCard label="PHI_NOD" techData={["INERTIA: 0.12", "STIFFNESS: 100", "DAMPING: 15"]} isZeroGravity={isZeroGravity} className="md:col-span-4 lg:col-span-3 row-span-1 flex flex-col justify-end gap-4 bg-gradient-to-br from-[#050505] to-[#0a0a0a]">
        <blockquote className="font-syne text-3xl italic text-white/90 leading-tight tracking-tighter">
            "Design is the silence. Code is the noise that makes it meaningful."
        </blockquote>
        <p className="font-mono text-xs text-[var(--accent)]">/ logic_v2.0_stable</p>
      </MagneticCard>

      <MagneticCard label="EXP_NOD" techData={["RESUME_SYNC: ON", "PRINT_READY: TRUE"]} isZeroGravity={isZeroGravity} className="md:col-span-2 lg:col-span-3 row-span-1 bg-[var(--accent)] text-[#050505] transition-colors duration-1000">
        <div className="flex flex-col h-full justify-between">
            <div className="font-syne text-5xl tracking-tighter">05+ YRS</div>
            <div className="font-mono font-bold text-sm uppercase tracking-widest">Architecting Realities</div>
        </div>
      </MagneticCard>
    </div>
  );
};
