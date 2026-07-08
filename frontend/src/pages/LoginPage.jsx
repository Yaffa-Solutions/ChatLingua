import { motion } from 'framer-motion';
import LoginForm from '../components/auth/LoginForm';

export default function LoginPage({ onLogin, onSwitch }) {
  return (
    <div className="min-h-screen bg-paper flex overflow-hidden relative">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-white/50">
        <div className="relative z-10 text-center max-w-md px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-lg bg-marigold flex items-center justify-center shadow-sm">
              <svg className="w-12 h-12 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m0 4h6m-6 4h6m-6 4h6" />
              </svg>
            </div>
          </motion.div>
          <h1 className="text-display-hero text-ink mb-3">ChatLingua</h1>
          <p className="text-body-large text-ink-70">
            Learn out loud. Get corrected kindly.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex justify-center gap-3"
          >
            {['English', 'Spanish', 'French', 'Arabic'].map((lang, i) => (
              <span key={lang} className="tag-language">
                {lang}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          <LoginForm onSubmit={onLogin} onSwitch={onSwitch} />
        </div>
      </div>
    </div>
  );
}
