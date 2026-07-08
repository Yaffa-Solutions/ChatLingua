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
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-2 flex items-center gap-2">
      <button
        type="button"
        className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-secondary hover:bg-white/5 transition-all flex-shrink-0"
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
        className="flex-1 bg-transparent text-gray-100 placeholder-gray-500 outline-none text-sm px-2"
      />

      <motion.button
        type="submit"
        disabled={!message.trim() || disabled}
        className={`
          w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300 flex-shrink-0
          ${message.trim()
            ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20'
            : 'bg-white/5 text-gray-500'
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
