
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export const TerminalFooter: React.FC<{ isZeroGravity?: boolean, onTriggerZenith?: () => void }> = ({ isZeroGravity, onTriggerZenith }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([
    'System initialization complete.',
    'Atmospheric shaders: ONLINE',
    'Physics engine: STABLE',
    'Type "--help" or "zenith 1" to begin.'
  ]);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isZeroGravity) {
      setHistory(h => [...h, '>> WARNING: GRAVITY_ENGINE_FAILURE', '>> SYSTEM_OVERRIDE_ACTIVE', '>> INPUT_LOCKED']);
    }
  }, [isZeroGravity]);

  const commands: Record<string, () => void> = {
    '--help': () => setHistory(h => [...h, '> --help', 'Available: --contact, --about, --clear, --status, --stack, zenith 1']),
    '--contact': () => setHistory(h => [...h, '> --contact', 'EMAIL: touseefpanjtan52@gmail.com', 'GITHUB: github.com/orewa-zenith', 'LOCATION: Distributed Node']),
    '--about': () => setHistory(h => [...h, '> --about', 'Touseef Panjtan (Zenith): Creative Engineer building high-fidelity digital experiences.']),
    '--clear': () => setHistory([]),
    '--status': () => setHistory(h => [...h, '> --status', 'CORE: Operational', 'LATENCY: 12ms', 'UPTIME: 99.99%', 'LH_SCORE: 100']),
    '--stack': () => setHistory(h => [...h, '> --stack', 'TECH: React, Three.js, GLSL, Framer Motion, TypeScript']),
    'zenith 1': () => {
        setHistory(h => [...h, '> zenith 1', 'INITIALIZING_QUANTUM_OVERRIDE...', 'BYPASSING_GRAVITY_LOCKS...']);
        onTriggerZenith?.();
    }
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (isZeroGravity) return;
    const rawInput = input.trim().toLowerCase();
    
    // Command mapping
    if (commands[rawInput]) {
      commands[rawInput]();
    } else if (rawInput !== '') {
      setHistory(h => [...h, `> ${input}`, `Error: '${input}' is not recognized. Try '--help'`]);
    }
    setInput('');
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <footer className="bg-[#050505] border-t border-white/5 py-16 px-8 relative overflow-hidden transition-colors duration-1000">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <motion.div layout className="flex flex-col justify-between h-full py-2">
          <div>
            <motion.h2 
              layout
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="font-syne text-5xl text-[var(--accent)] mb-6 tracking-tighter select-none transition-colors duration-1000"
            >
              ZENITH_SYS<span className="animate-pulse">.</span>
            </motion.h2>
            <motion.p layout className="font-mono text-[10px] md:text-xs text-white/40 max-w-sm leading-relaxed uppercase tracking-widest select-none">
              Engineered with extreme precision using React, Three.js & GLSL Shaders. 
              Optimized for high-performance visual computing.
            </motion.p>
          </div>
          
          <motion.div layout className="mt-12 lg:mt-32 space-y-4">
            <div className="font-mono text-[10px] text-white/20 uppercase tracking-[0.3em] select-none">
              &copy; 2024 OREWA_ZENITH / OBSIDIAN_REL
            </div>
            <div className="flex gap-4">
               <div className="w-2 h-2 rounded-full bg-[var(--accent)]/30 transition-colors" />
               <div className="w-2 h-2 rounded-full bg-white/10" />
               <div className="w-2 h-2 rounded-full bg-white/10" />
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          layout
          drag={isZeroGravity}
          dragConstraints={false}
          dragElastic={0.4}
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          animate={isZeroGravity ? {
            x: [0, -20, 20, 0],
            y: [0, 25, -25, 0],
            rotate: [0, -3, 3, 0],
            opacity: 0.8,
            transition: { duration: 7, repeat: Infinity, ease: "easeInOut" }
          } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
          transition={{ layout: { type: 'spring', stiffness: 100, damping: 12 } }}
          className="glass rounded-2xl p-6 h-[320px] flex flex-col font-mono text-[11px] border border-white/5 shadow-2xl relative select-none"
        >
          <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2 opacity-30">
            <div className="w-2 h-2 rounded-full bg-red-500/50" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
            <div className="w-2 h-2 rounded-full bg-green-500/50" />
            <span className="ml-2 text-[9px] uppercase tracking-tighter">bash — 80x24 — {isZeroGravity ? 'ERR' : 'ROOT'}</span>
          </div>

          <div ref={terminalRef} className="flex-1 overflow-y-auto mb-4 scrollbar-hide opacity-80 pointer-events-none">
            {history.map((line, i) => (
              <div key={i} className={`mb-1.5 ${line.startsWith('>') || line.startsWith('>>') ? 'text-[var(--accent)]' : 'text-white/60'}`}>
                {line}
              </div>
            ))}
          </div>

          <form onSubmit={handleCommand} className="flex gap-3 items-center border-t border-white/5 pt-4">
            <span className="text-[var(--accent)] animate-pulse transition-colors">❯</span>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-transparent border-none outline-none flex-1 text-white placeholder:text-white/10"
              placeholder={isZeroGravity ? "TERMINAL_LOCKED" : "Execute command..."}
              disabled={isZeroGravity}
              autoFocus
            />
            {input === '' && !isZeroGravity && (
              <div className="w-2 h-4 bg-[var(--accent)]/50 animate-[blink_1s_infinite]" />
            )}
          </form>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blink {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </footer>
  );
};
