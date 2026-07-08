import { motion } from 'framer-motion';
import SignupForm from '../components/auth/SignupForm';
import ParticleBackground from '../components/ui/ParticleBackground';

export default function SignupPage({ onRegister, onSwitch }) {
  return (
    <div className="min-h-screen flex overflow-hidden relative">
      <ParticleBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-dark-400 to-secondary/5" />

      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
        <div className="relative z-10 text-center max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-32 h-32 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-accent via-primary to-secondary p-[3px]">
              <div className="w-full h-full rounded-3xl bg-dark-400 flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold gradient-text mb-4"
          >
            Join ChatLingua
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 text-lg"
          >
            Connect with language learners worldwide and start practicing today.
          </motion.p>

          {/* Feature list */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 space-y-4 text-left max-w-xs mx-auto"
          >
            {[
              { icon: 'M3 5h12M9 3v2m0 4h6m-6 4h6m-6 4h6', text: 'Real conversations' },
              { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', text: 'AI-powered translation' },
              { icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', text: 'Secure & private' },
            ].map(({ icon, text }, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                  </svg>
                </div>
                <span className="text-sm text-gray-300">{text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="absolute top-40 right-10 w-72 h-72 rounded-full bg-accent/10 blur-3xl"
          animate={{ scale: [1, 1.3, 1], rotate: [0, -60, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          <SignupForm onSubmit={onRegister} onSwitch={onSwitch} />
        </div>
      </div>
    </div>
  );
}
