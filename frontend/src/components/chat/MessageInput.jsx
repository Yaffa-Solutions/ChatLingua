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
    <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-white border border-stone-line rounded-lg px-3 py-2 shadow-sm">
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
          w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-150 flex-shrink-0
          ${message.trim()
            ? 'bg-ink text-paper shadow-sm'
            : 'bg-paper text-ink-40'
          }
        `}
        whileHover={message.trim() ? { scale: 1.05 } : {}}
        whileTap={message.trim() ? { scale: 0.95 } : {}}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </motion.button>
    </form>
  );
}
