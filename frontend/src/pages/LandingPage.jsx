import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';

// High-quality, clean language exchange presets
const HERO_PRESETS = [
  {
    lang: 'Spanish',
    flag: '🇪🇸',
    partner: 'Sofia (Native Spanish)',
    learnerMsg: '¡Hola! ¿Cómo estás hoy? Estoy practicando mi español.',
    partnerResponse: '¡Hola! Todo muy bien. ¡Tu español es excelente! ¿Qué hiciste hoy?',
    translation: 'Hello! Everything is great. Your Spanish is excellent! What did you do today?',
    correction: null,
  },
  {
    lang: 'French',
    flag: '🇫🇷',
    partner: 'Lucas (Native French)',
    learnerMsg: 'J\'ai rencontré mes amis au café ce matin.',
    partnerResponse: 'C\'est super! Quel café as-tu visité?',
    translation: 'I met my friends at the coffee shop this morning.',
    correctionOriginal: 'J\'ai rencontré',
    correctionFixed: 'J\'ai retrouvé',
    correctionNote: 'Use "retrouver" when meeting up with scheduled friends.',
  },
  {
    lang: 'German',
    flag: '🇩🇪',
    partner: 'Hannah (Native German)',
    learnerMsg: 'Ich habe heute einen Deutschkurs besucht.',
    partnerResponse: 'Wunderbar! Wie gefällt dir die deutsche Sprache bisher?',
    translation: 'I attended a German class today.',
    correction: null,
  },
];

const FEATURES = [
  {
    title: 'Inline Corrections',
    desc: 'Receive gentle, constructive grammar feedback without interrupting your conversational flow.',
    icon: (
      <svg className="w-5 h-5 text-marigold-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    title: 'Gemini AI Translation',
    desc: 'Stuck on a tricky word? One-tap instant translation keeps your dialogue moving effortlessly.',
    icon: (
      <svg className="w-5 h-5 text-sprout" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m0 4h6m-6 4h6m-6 4h6" />
      </svg>
    ),
  },
  {
    title: 'Native Peer Exchange',
    desc: 'Match directly with native speakers worldwide eager to learn your native language.',
    icon: (
      <svg className="w-5 h-5 text-marigold-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Privacy & Security',
    desc: 'Enjoy a clean, ad-free environment designed solely for focused language acquisition.',
    icon: (
      <svg className="w-5 h-5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
];

const STEPS = [
  {
    num: '1',
    title: 'Set Your Languages',
    desc: 'Select your native tongue and the target language you are actively mastering.',
  },
  {
    num: '2',
    title: 'Connect with Partners',
    desc: 'Match with active native speakers ready to exchange conversation and feedback.',
  },
  {
    num: '3',
    title: 'Chat & Improve Daily',
    desc: 'Exchange natural messages assisted by 1-tap translation and inline grammar notes.',
  },
];

const FAQS = [
  {
    q: 'Is ChatLingua free to use?',
    a: 'Yes, ChatLingua is 100% free for peer-to-peer language exchange, real-time messaging, and translation assistance.',
  },
  {
    q: 'How do inline corrections work?',
    a: 'When chatting, clicking on a message highlights subtle grammar suggestions with phonetic and usage notes.',
  },
  {
    q: 'What languages are supported?',
    a: 'We support English, Spanish, French, Arabic, German, and Turkish, with more added based on community requests.',
  },
  {
    q: 'Does it work well on mobile phones?',
    a: 'Yes, ChatLingua is designed to be fully responsive and lightweight on mobile, tablet, and desktop screens.',
  },
];

export default function LandingPage({ onNavigateLogin, onNavigateSignup }) {
  const [activeTab, setActiveTab] = useState(0);
  const [showTranslation, setShowTranslation] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  const activePreset = HERO_PRESETS[activeTab];

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-ink selection:bg-marigold-tint selection:text-ink">
      
      {/* Reusable Clean Header */}
      <Navbar onNavigateLogin={onNavigateLogin} onNavigateSignup={onNavigateSignup} />

      {/* Hero Section */}
      <section className="pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-stone-line/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            
            {/* Hero Content Left */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-marigold-tint border border-marigold/30 text-caption text-marigold-deep font-semibold">
                <span className="w-2 h-2 rounded-full bg-sprout animate-pulse" />
                Over 10,000+ active language partners online
              </div>

              <h1 className="text-display-hero text-ink text-4xl sm:text-5xl lg:text-[52px] font-display font-semibold leading-[1.12] tracking-tight">
                Master Languages <br className="hidden sm:inline" />
                <span className="text-marigold-deep">Through Real Conversation.</span>
              </h1>

              <p className="text-body-large text-ink-70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Connect with native speakers around the world. Practice real conversations with real-time AI translation and gentle inline grammar feedback.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onNavigateSignup}
                  className="w-full sm:w-auto px-7 py-3.5 text-body font-semibold shadow-2xs"
                >
                  Start Practicing Free
                </Button>
                <a
                  href="#demo"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-caption font-semibold text-ink hover:text-marigold-deep px-5 py-3 transition-colors rounded-md border border-stone-line bg-white/70"
                >
                  <svg className="w-4 h-4 text-marigold-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Try Live Demo
                </a>
              </div>
            </div>

            {/* Hero Visual Right: Single Beautiful Interactive Preview Element */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-xl border border-stone-line shadow-md p-6 space-y-4 max-w-lg mx-auto">
                <div className="flex items-center justify-between border-b border-stone-line/70 pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar alt={activePreset.partner} size="sm" status="online" />
                    <div>
                      <h4 className="font-semibold text-ink text-caption">{activePreset.partner}</h4>
                      <p className="text-[11px] text-sprout font-medium">Native Speaker Partner</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowTranslation(!showTranslation)}
                    className="px-2.5 py-1 rounded-md text-[12px] font-medium bg-[#FAF9F5] border border-stone-line text-ink-70 hover:text-ink transition-colors"
                  >
                    {showTranslation ? 'Hide Translation' : '1-Tap Translate'}
                  </button>
                </div>

                {/* Simulated Chat Message Exchange */}
                <div className="space-y-3 py-1">
                  <div className="flex justify-end">
                    <div className="bubble-learner text-caption max-w-[88%]">
                      <p>{activePreset.learnerMsg}</p>
                    </div>
                  </div>

                  {activePreset.correctionOriginal && (
                    <div className="flex justify-end pr-1">
                      <div className="bubble-correction text-[12px] max-w-[88%]">
                        <p className="font-semibold text-ink">Grammar Tip:</p>
                        <p>
                          <span className="strike-correction">{activePreset.correctionOriginal}</span>{' '}
                          <span className="text-replacement">{activePreset.correctionFixed}</span>
                        </p>
                        <p className="text-phonetic text-ink-70 text-[11px] mt-0.5">{activePreset.correctionNote}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-start">
                    <div className="bubble-native text-caption max-w-[88%]">
                      <p>{activePreset.partnerResponse}</p>
                      {showTranslation && (
                        <p className="text-[12px] text-marigold-deep font-medium mt-1 pt-1 border-t border-marigold/20">
                          ✨ {activePreset.translation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Interactive Preset Buttons */}
                <div className="pt-2 flex items-center justify-center gap-2 border-t border-stone-line/60">
                  {HERO_PRESETS.map((preset, idx) => (
                    <button
                      key={preset.lang}
                      onClick={() => setActiveTab(idx)}
                      className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors ${
                        activeTab === idx
                          ? 'bg-marigold text-ink font-semibold shadow-2xs'
                          : 'bg-[#FAF9F5] text-ink-70 hover:bg-stone-line/40'
                      }`}
                    >
                      {preset.flag} {preset.lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 border-b border-stone-line/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <h2 className="text-display-heading text-ink text-3xl font-display font-semibold">
              Designed for Natural Fluency
            </h2>
            <p className="text-body text-ink-70">
              Clean tools to help you communicate naturally without language anxiety.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feat) => (
              <div key={feat.title} className="p-6 bg-white rounded-lg border border-stone-line space-y-3 hover:border-marigold/50 transition-colors shadow-2xs">
                <div className="w-10 h-10 rounded-md bg-[#FAF9F5] border border-stone-line/70 flex items-center justify-center">
                  {feat.icon}
                </div>
                <h3 className="font-semibold text-ink text-body font-display">{feat.title}</h3>
                <p className="text-caption text-ink-70 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 border-b border-stone-line/50 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <h2 className="text-display-heading text-ink text-3xl font-display font-semibold">
              How ChatLingua Works
            </h2>
            <p className="text-body text-ink-70">
              Three simple steps to start exchanging conversations today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.num} className="p-6 rounded-lg bg-[#FAF9F5] border border-stone-line/80 space-y-3">
                <div className="w-9 h-9 rounded-md bg-marigold text-ink font-bold text-caption flex items-center justify-center shadow-2xs">
                  {step.num}
                </div>
                <h3 className="text-body font-semibold text-ink font-display">{step.title}</h3>
                <p className="text-caption text-ink-70 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Languages Matrix */}
      <section id="languages" className="py-20 border-b border-stone-line/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-display-heading text-ink text-3xl font-display font-semibold">
              Supported Language Exchanges
            </h2>
            <p className="text-body text-ink-70">Connect with active partners across the globe.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'English', flag: '🇬🇧', count: '4,200+ partners' },
              { name: 'Spanish', flag: '🇪🇸', count: '3,800+ partners' },
              { name: 'French', flag: '🇫🇷', count: '2,500+ partners' },
              { name: 'Arabic', flag: '🇸🇦', count: '1,900+ partners' },
              { name: 'German', flag: '🇩🇪', count: '1,700+ partners' },
              { name: 'Turkish', flag: '🇹🇷', count: '1,200+ partners' },
            ].map((lang) => (
              <div key={lang.name} className="p-4 bg-white rounded-lg border border-stone-line text-center space-y-1.5 hover:border-marigold transition-colors">
                <span className="text-2xl block">{lang.flag}</span>
                <h4 className="font-semibold text-ink text-caption">{lang.name}</h4>
                <p className="text-[11px] text-ink-70">{lang.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 border-b border-stone-line/50 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-display-heading text-ink text-3xl font-display font-semibold">
              Frequently Asked Questions
            </h2>
            <p className="text-body text-ink-70">Everything you need to know about ChatLingua.</p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-[#FAF9F5] p-4 rounded-lg border border-stone-line">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-semibold text-ink text-body"
                >
                  <span>{faq.q}</span>
                  <svg
                    className={`w-4 h-4 text-ink-40 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === idx && (
                  <p className="mt-2.5 text-caption text-ink-70 leading-relaxed border-t border-stone-line/60 pt-2.5">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simplified CTA Banner */}
      <section className="py-16 bg-marigold-tint/60 border-b border-marigold/20">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-5">
          <h2 className="text-display-heading text-ink text-3xl font-display font-semibold">
            Ready to Start Conversing?
          </h2>
          <p className="text-body text-ink-70 max-w-xl mx-auto">
            Join thousands of language learners exchanging real conversations today. 100% free to start.
          </p>
          <div>
            <Button
              variant="primary"
              size="lg"
              onClick={onNavigateSignup}
              className="px-7 py-3 text-body font-semibold shadow-2xs"
            >
              Create Free Account
            </Button>
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className="py-8 bg-white text-caption text-ink-70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-marigold flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m0 4h6m-6 4h6m-6 4h6" />
              </svg>
            </div>
            <span className="font-display font-semibold text-ink">ChatLingua</span>
            <span className="text-[12px] text-ink-40 ml-2">© {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-[13px]">
            <a href="#features" className="hover:text-ink transition-colors">Features</a>
            <a href="#languages" className="hover:text-ink transition-colors">Languages</a>
            <a href="#faq" className="hover:text-ink transition-colors">FAQ</a>
            <button onClick={onNavigateLogin} className="hover:text-ink transition-colors">Sign In</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
