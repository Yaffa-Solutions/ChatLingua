import { motion } from 'framer-motion';

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-full text-center px-6"
    >
      <div className="mb-6">
        <div className="w-20 h-20 rounded-md bg-marigold-tint flex items-center justify-center">
          <svg className="w-10 h-10 text-marigold-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
      </div>

      <h2 className="text-display-heading text-ink mb-1">Select a Conversation</h2>
      <p className="text-body text-ink-70 max-w-sm">
        Choose a language partner from the sidebar and start practicing your conversation skills.
      </p>

      <div className="mt-6 flex gap-2">
        {['Hello!', 'How are you?', 'I am learning'].map((text, i) => (
          <span
            key={text}
            className="tag-language"
          >
            {text}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
