import { motion } from 'framer-motion';

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-full text-center px-6"
    >
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 2, -2, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-6"
      >
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary via-accent to-secondary p-[2px]">
          <div className="w-full h-full rounded-3xl bg-dark-400 flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        </div>
      </motion.div>

      <h2 className="text-2xl font-bold gradient-text mb-2">Select a Conversation</h2>
      <p className="text-gray-400 text-sm max-w-sm">
        Choose a language partner from the sidebar and start practicing your conversation skills.
      </p>

      <div className="mt-8 flex gap-3">
        {['Hello!', 'How are you?', 'I am learning'].map((text, i) => (
          <motion.span
            key={text}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="px-3 py-1.5 rounded-full glass text-xs text-gray-300"
          >
            {text}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
