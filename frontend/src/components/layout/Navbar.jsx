import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';

export default function Navbar({ onNavigateLogin, onNavigateSignup, activeSection }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Live Demo', href: '#demo' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Languages', href: '#languages' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-[#FAF9F5]/95 backdrop-blur-md border-b border-stone-line/70 shadow-2xs'
          : 'bg-[#FAF9F5]/80 backdrop-blur-sm border-b border-stone-line/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-6 h-6 rounded-xl bg-marigold flex items-center justify-center shadow-2xs transition-transform group-hover:scale-105">
            <svg className="w-5 h-5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m0 4h6m-6 4h6m-6 4h6" />
            </svg>
          </div>
          <span className="font-display font-semibold text-ink text-lg tracking-tight">ChatLingua</span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-caption font-medium text-ink-70">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-ink transition-colors relative py-1 hover:font-semibold"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={onNavigateLogin}
            className="px-3.5 py-2 text-caption font-semibold text-ink hover:text-marigold-deep transition-colors"
          >
            Sign In
          </button>
          <Button
            variant="primary"
            size="sm"
            onClick={onNavigateSignup}
            className="px-4 py-2 text-caption font-semibold rounded-md shadow-2xs"
          >
            Get Started Free
          </Button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-ink hover:bg-stone-line/30 transition-colors focus:outline-none"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#FAF9F5] border-b border-stone-line px-4 pt-2 pb-6 space-y-4 shadow-md overflow-hidden"
          >
            <nav className="flex flex-col space-y-3 pt-2 text-body font-medium text-ink-70 border-b border-stone-line/60 pb-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-ink px-2 py-1.5 rounded-md hover:bg-white/60 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex flex-col gap-2.5 pt-1">
              <Button
                variant="primary"
                size="md"
                className="w-full text-center font-semibold py-2.5"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateSignup?.();
                }}
              >
                Get Started Free
              </Button>
              <button
                type="button"
                className="w-full text-center py-2.5 text-caption font-semibold text-ink-70 hover:text-ink rounded-md border border-stone-line bg-white/70"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateLogin?.();
                }}
              >
                Sign In
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
