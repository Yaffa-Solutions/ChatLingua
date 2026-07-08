import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-150 ${
        scrolled ? 'bg-white border-b border-stone-line shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-marigold flex items-center justify-center">
              <svg className="w-4 h-4 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m0 4h6m-6 4h6m-6 4h6" />
              </svg>
            </div>
            <span className="text-display-heading text-ink">ChatLingua</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-caption text-ink-70 hidden sm:block">Learn languages through conversation</span>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
