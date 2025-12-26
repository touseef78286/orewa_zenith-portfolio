
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';

export const Navbar: React.FC<{ isZeroGravity?: boolean }> = ({ isZeroGravity }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Projects', href: '#work' },
    { name: 'Engineering', href: '#engineering' },
  ];

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-[100] flex justify-center p-6 ${isZeroGravity ? '' : 'pointer-events-none'}`}>
        <motion.nav
          layout
          drag={isZeroGravity}
          dragConstraints={false}
          dragElastic={0.1}
          initial={{ y: -100, opacity: 0 }}
          animate={isZeroGravity ? {
            y: [0, 10, -10, 0],
            x: [0, 5, -5, 0],
            rotate: [0, 0.5, -0.5, 0],
            opacity: 1,
            transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          } : { 
            y: 0, 
            opacity: 1,
            x: 0,
            rotate: 0
          }}
          transition={{ 
            layout: { type: 'spring', stiffness: 100, damping: 15 },
            type: 'spring', stiffness: 100, damping: 20 
          }}
          style={{
            backdropFilter: isScrolled ? 'blur(16px)' : 'blur(8px)',
            backgroundColor: isScrolled ? 'rgba(5, 5, 5, 0.8)' : 'rgba(5, 5, 5, 0.4)',
            borderColor: isScrolled ? 'rgba(0, 255, 163, 0.2)' : 'rgba(255, 255, 255, 0.05)',
          }}
          className="pointer-events-auto flex items-center justify-between px-6 py-3 rounded-full border transition-all duration-500 max-w-5xl w-full shadow-2xl select-none"
        >
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-[#00FFA3] shadow-[0_0_10px_#00FFA3]" />
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-[#00FFA3] animate-ping opacity-50" />
            </div>
            <span className="font-syne text-lg tracking-tighter group-hover:text-[#00FFA3] transition-colors">
              ZENITH<span className="opacity-40">_SYS</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={isZeroGravity ? undefined : link.href}
                  className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 hover:text-[#00FFA3] transition-colors relative group py-2"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#00FFA3] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>
            <div className="h-4 w-[1px] bg-white/10 mx-2" />
            <button
              onClick={() => !isZeroGravity && window.print()}
              className="group flex items-center gap-2 bg-[#00FFA3] text-[#050505] px-5 py-2 rounded-full font-bold text-xs hover:scale-105 active:scale-95 transition-all"
            >
              RESUME
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <button 
            className="md:hidden text-white/80 hover:text-[#00FFA3] transition-colors"
            onClick={() => !isZeroGravity && setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </motion.nav>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && !isZeroGravity && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="fixed inset-0 z-[90] bg-[#050505]/80 md:hidden flex flex-col items-center justify-center gap-8 p-10"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setMobileMenuOpen(false)}
                className="font-syne text-5xl uppercase tracking-tighter hover:text-[#00FFA3] transition-colors"
              >
                {link.name}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
