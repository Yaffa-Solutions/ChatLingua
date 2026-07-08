import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from '../ui/Avatar';

export default function ChatHeader({ receiver, onDeleteChat }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="glass rounded-2xl p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar src={receiver?.image} alt={receiver?.name || 'User'} size="md" />
        <div>
          <h3 className="font-semibold text-gray-100 text-sm">{receiver?.name || 'Select a chat'}</h3>
          <p className="text-xs text-gray-400">{receiver?.lang || ''}</p>
        </div>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-9 h-9 flex items-center justify-center rounded-xl glass text-gray-400 hover:text-white transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
          </svg>
        </button>

        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -5 }}
              className="absolute right-0 mt-2 w-44 glass rounded-xl overflow-hidden z-30"
            >
              <button
                onClick={() => { setShowMenu(false); onDeleteChat?.(); }}
                className="w-full px-4 py-2.5 text-sm text-red-400 hover:bg-white/10 flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Chat
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
