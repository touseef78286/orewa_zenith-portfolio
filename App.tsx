import React, { useEffect, useRef, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import { Hero } from './components/Hero';
import { BentoGrid } from './components/BentoGrid';
import { ProjectCarousel } from './components/ProjectCarousel';
import { Scene } from './components/Scene';
import { TerminalFooter } from './components/Terminal';
import { Navbar } from './components/Navbar';
import { CustomCursor } from './components/CustomCursor';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const lenisRef = useRef<Lenis | null>(null);
  const [isZeroGravity, setIsZeroGravity] = useState(false);
  const [activeProject, setActiveProject] = useState<null | { title: string; desc: string }>(null);
  const [level, setLevel] = useState(0); // Sequence progress for Z-E-N-I-T-H-1
  const [fps, setFps] = useState(60);
  const [showGlitchLine, setShowGlitchLine] = useState(false);
  const [isTrailActive, setIsTrailActive] = useState(false);

  const playBassSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(40, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(20, audioCtx.currentTime + 1.5);
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 1.5);
    } catch (e) {}
  };

  const activateZenithMode = () => {
    // Clear any lingering per-letter effects before entering blast phase
    document.body.classList.remove('effect-e-flash', 'effect-t-matrix');
    document.body.className = 'effect-blast';
    
    setLevel(0);
    setIsTrailActive(false);

    setTimeout(() => {
      // Final transition to stable Zero-G state
      document.body.className = isZeroGravity ? '' : 'scanline-overlay';
      setIsZeroGravity(true);
      document.documentElement.style.setProperty('--accent', '#BD00FF');
      document.documentElement.style.setProperty('--accent-glow', 'rgba(189, 0, 255, 0.5)');
    }, 800);
  };

  useEffect(() => {
    let frames = 0;
    let lastTime = performance.now();
    const updateFps = () => {
      frames++;
      const now = performance.now();
      if (now >= lastTime + 1000) {
        setFps(frames);
        frames = 0;
        lastTime = now;
      }
      requestAnimationFrame(updateFps);
    };
    requestAnimationFrame(updateFps);

    lenisRef.current = new Lenis({ duration: 1.2, smoothWheel: true });
    const raf = (time: number) => {
      if (!isZeroGravity) lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    const handleKeyDown = (e: KeyboardEvent) => {
      const char = e.key.toUpperCase();
      if (e.key === 'Escape') {
        setIsZeroGravity(false);
        setActiveProject(null);
        setLevel(0);
        setIsTrailActive(false);
        document.body.className = '';
        document.documentElement.style.setProperty('--accent', '#00FFA3');
        return;
      }
      
      const targetSeq = 'ZENITH1';
      if (char === targetSeq[level]) {
        const nextLevel = level + 1;
        setLevel(nextLevel);
        const body = document.body;
        
        switch(char) {
          case 'Z': setShowGlitchLine(true); setTimeout(() => setShowGlitchLine(false), 800); break;
          case 'E': body.classList.add('effect-e-flash'); setTimeout(() => body.classList.remove('effect-e-flash'), 500); break;
          case 'N': playBassSound(); break;
          case 'I': setIsTrailActive(true); break;
          case 'T': body.classList.add('effect-t-matrix'); setTimeout(() => body.classList.remove('effect-t-matrix'), 1500); break;
          case 'H': 
            // 'H' effect removed as per user request (no more big bang shake)
            break;
          case '1': 
            activateZenithMode(); 
            break;
        }
      } else if (char.length === 1 && ![' ', '-', '_'].includes(char)) {
        // Sequence reset: kill any persistent effects immediately
        if (level > 0) {
          setLevel(0);
          setIsTrailActive(false);
          document.body.classList.remove('effect-e-flash', 'effect-t-matrix');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [level, isZeroGravity]);

  return (
    <div className={`relative min-h-screen bg-[#050505] transition-all duration-1000 ${isZeroGravity ? 'overflow-hidden h-screen' : ''}`}>
      {showGlitchLine && <div className="z-glitch-line" />}
      <CustomCursor isZeroGravity={isZeroGravity} isTrailActive={isTrailActive} />
      
      <AnimatePresence>
        {isZeroGravity && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] pointer-events-none p-8 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--accent)]">
            <div className="absolute top-8 left-8 flex flex-col gap-2">
                <p className="animate-pulse">SYSTEM_STATUS: ZENITH_ACTIVE</p>
                <p>KERNEL: 0x55F2A_QUANTUM</p>
                <div className="w-32 h-1 bg-white/5 overflow-hidden">
                    <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-full h-full bg-[var(--accent)]" />
                </div>
            </div>
            <div className="absolute top-8 right-8 text-right space-y-1">
                <p>FPS: {fps}</p>
                <p>CLOCK: {new Date().toLocaleTimeString()}</p>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <div className="w-[400px] h-[400px] rounded-full border border-[var(--accent)]/5 animate-[ping_4s_infinite]" />
                <div className="absolute w-[250px] h-[250px] rounded-full glass border border-[var(--accent)]/20 shadow-[0_0_100px_var(--accent-glow)] flex items-center justify-center pointer-events-auto">
                    <div className="text-center group cursor-help">
                        <div className="w-12 h-12 border-2 border-[var(--accent)] rounded-full animate-spin mx-auto mb-4 border-t-transparent" />
                        <p className="text-[var(--accent)] text-xs font-syne tracking-widest group-hover:scale-110 transition-transform">ZENITH_CORE</p>
                    </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] bg-[#050505]/95 backdrop-blur-2xl flex items-center justify-center p-12">
            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20">
                <div className="space-y-8">
                    <h2 className="text-[var(--accent)] font-syne text-7xl uppercase tracking-tighter leading-none">{activeProject.title}</h2>
                    <p className="font-mono text-white/50 text-xs leading-relaxed uppercase tracking-widest">{activeProject.desc}</p>
                    <button onClick={() => setActiveProject(null)} className="font-mono text-[10px] text-[var(--accent)] underline underline-offset-8">CLOSE_PORTAL</button>
                </div>
                <div className="aspect-video glass rounded-3xl flex items-center justify-center border border-white/10">
                    <p className="font-mono text-[9px] opacity-20">DECODING_VISUAL_STREAM...</p>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 pointer-events-none z-0"><Scene isZeroGravity={isZeroGravity} /></div>

      <div className={`relative z-10 transition-all duration-1000 ${isZeroGravity ? 'cursor-grab active:cursor-grabbing' : ''}`}>
        <Navbar isZeroGravity={isZeroGravity} />
        <main>
          <Hero isZeroGravity={isZeroGravity} />
          <section id="work" className="py-20 px-4 md:px-10 lg:px-20 max-w-7xl mx-auto">
            <motion.h2 layout className="text-[var(--accent)] font-syne text-5xl md:text-7xl mb-12 uppercase select-none tracking-tighter transition-colors">The Vault</motion.h2>
            <ProjectCarousel isZeroGravity={isZeroGravity} onProjectDrop={setActiveProject} />
          </section>
          <section id="engineering" className="py-20 px-4 md:px-10 lg:px-20 max-w-7xl mx-auto">
             <motion.h2 layout className="text-[var(--accent)] font-syne text-5xl md:text-7xl mb-12 uppercase select-none tracking-tighter transition-colors">Ecosystem</motion.h2>
            <BentoGrid isZeroGravity={isZeroGravity} />
          </section>
        </main>
        <TerminalFooter isZeroGravity={isZeroGravity} onTriggerZenith={activateZenithMode} />
      </div>
    </div>
  );
};

export default App;