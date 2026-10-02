import { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import Avatar from '../components/ui/Avatar';

export default function LoginPage({ onLogin, onSwitch, onBackHome }) {
  return (
    <div className="min-h-screen bg-[#FAF9F5] text-ink flex flex-col justify-between selection:bg-marigold-tint selection:text-ink">
      
      {/* Header Bar */}
      <header className="h-16 border-b border-stone-line/60 bg-[#FAF9F5] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex items-center justify-between">
        <button
          type="button"
          onClick={onBackHome}
          className="inline-flex items-center gap-2 text-caption font-semibold text-ink-70 hover:text-ink transition-colors px-3 py-1.5 rounded-md hover:bg-white border border-stone-line/50 shadow-2xs"
        >
          <svg className="w-4 h-4 text-marigold-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Home</span>
        </button>

        <a href="#" onClick={onBackHome} className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-marigold flex items-center justify-center shadow-2xs">
            <svg className="w-4 h-4 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m0 4h6m-6 4h6m-6 4h6" />
            </svg>
          </div>
          <span className="font-display font-semibold text-ink text-body">ChatLingua</span>
        </a>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Brand Focus Panel (Desktop) */}
          <div className="hidden lg:flex lg:col-span-7 flex-col justify-center space-y-6 pr-6">
            <div className="space-y-3">
              <span className="badge-level text-[12px] font-semibold">Language Partner Community</span>
              <h1 className="text-display-hero text-ink text-4xl font-display font-semibold leading-tight">
                Welcome Back to <br />
                <span className="text-marigold-deep">Your Conversations.</span>
              </h1>
              <p className="text-body text-ink-70 max-w-md leading-relaxed">
                Log in to continue chatting with your native language partners and practice with Gemini AI assistance.
              </p>
            </div>

            {/* Minimal Highlight Card */}
            <div className="p-5 bg-white rounded-xl border border-stone-line shadow-2xs space-y-3 max-w-md">
              <div className="flex items-center gap-3">
                <Avatar alt="Sofia" size="sm" status="online" />
                <div>
                  <h4 className="font-semibold text-ink text-caption">Sofia Laurent</h4>
                  <p className="text-[11px] text-sprout font-medium">Native French Partner</p>
                </div>
              </div>
              <div className="bubble-native text-caption py-2 px-3">
                <p>Bonjour! Content de te revoir pour pratiquer.</p>
                <p className="text-[11px] text-marigold-deep font-medium mt-1">✨ Hello! Glad to see you back for practice.</p>
              </div>
            </div>
          </div>

          {/* Right Form Card Container */}
          <div className="col-span-1 lg:col-span-5 flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-xl border border-stone-line shadow-md p-6 sm:p-8">
              <LoginForm onSubmit={onLogin} onSwitch={onSwitch} />
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-[12px] text-ink-70">
        <p>© {new Date().getFullYear()} ChatLingua. Simple, modern language learning.</p>
      </footer>
    </div>
  );
}
