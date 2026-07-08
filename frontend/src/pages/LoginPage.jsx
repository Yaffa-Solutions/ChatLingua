import { motion } from 'framer-motion';
import LoginForm from '../components/auth/LoginForm';
import ParticleBackground from '../components/ui/ParticleBackground';

export default function LoginPage({ onLogin, onSwitch }) {
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m0 4h6m-6 4h6m-6 4h6" />
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
            ChatLingua
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 text-lg"
          >
            Master languages through real conversations with native speakers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex justify-center gap-4"
          >
            {['English', 'Spanish', 'French', 'Arabic'].map((lang, i) => (
              <motion.span
                key={lang}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="px-4 py-2 rounded-full glass text-sm text-gray-300"
              >
                {lang}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Floating decorations */}
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-secondary/10 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          <LoginForm onSubmit={onLogin} onSwitch={onSwitch} />
        </div>
      </div>
    </div>
  );
}
