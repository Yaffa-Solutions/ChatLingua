import { motion } from 'framer-motion';
import SignupForm from '../components/auth/SignupForm';

export default function SignupPage({ onRegister, onSwitch }) {
  return (
    <div className="min-h-screen bg-paper flex overflow-hidden relative">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-white/50">
        <div className="relative z-10 text-center max-w-md px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-lg bg-sprout flex items-center justify-center shadow-sm">
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </motion.div>
          <h1 className="text-display-heading text-ink mb-3">Join ChatLingua</h1>
          <p className="text-body-large text-ink-70">
            Connect with language learners worldwide and start practicing today.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 space-y-4 text-left max-w-xs mx-auto"
          >
            {[
              { icon: 'M3 5h12M9 3v2m0 4h6m-6 4h6m-6 4h6', text: 'Real conversations' },
              { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', text: 'AI-powered translation' },
              { icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', text: 'Secure & private' },
            ].map(({ icon, text }, i) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-sm bg-marigold-tint flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-marigold-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                  </svg>
                </div>
                <span className="text-body text-ink-70">{text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          <SignupForm onSubmit={onRegister} onSwitch={onSwitch} />
        </div>
      </div>
    </div>
  );
}
