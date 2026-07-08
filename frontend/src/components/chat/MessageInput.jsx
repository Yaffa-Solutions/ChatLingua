import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function MessageInput({ onSend, onTyping, disabled }) {
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setMessage('');
    inputRef.current?.focus();
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    onTyping?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-white border-[1.5px] border-stone-line rounded-full px-2 py-1 shadow-sm">
      <button
        type="button"
        className="w-9 h-9 flex items-center justify-center rounded-full text-ink-40 hover:text-marigold transition-colors flex-shrink-0"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      <input
        ref={inputRef}
        type="text"
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        disabled={disabled}
        className="flex-1 bg-transparent text-ink placeholder-ink-40 outline-none text-body px-1"
      />

      <motion.button
        type="submit"
        disabled={!message.trim() || disabled}
        className={`
          w-9 h-9 flex items-center justify-center rounded-full transition-all duration-150 flex-shrink-0
          ${message.trim()
            ? 'bg-ink text-paper shadow-sm'
            : 'bg-paper text-ink-40'
          }
        `}
        whileHover={message.trim() ? { scale: 1.05 } : {}}
        whileTap={message.trim() ? { scale: 0.95 } : {}}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
        </svg>
      </motion.button>
    </form>
  );
}
