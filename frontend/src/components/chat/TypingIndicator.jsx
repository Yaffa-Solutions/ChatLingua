import { motion } from 'framer-motion';

export default function TypingIndicator({ username }) {
  if (!username) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      className="flex items-center gap-2 px-2 py-1"
    >
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-ink-40"
            animate={{
              y: [0, -4, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      <span className="text-caption text-ink-70 italic">{username} is typing...</span>
    </motion.div>
  );
}
