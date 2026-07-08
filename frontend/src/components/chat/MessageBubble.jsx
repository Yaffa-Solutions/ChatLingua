import { useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function MessageBubble({ message, isOwn, nativeLang, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const [translated, setTranslated] = useState(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [translating, setTranslating] = useState(false);
  const { user } = useAuth();

  const handleTranslate = async () => {
    if (translated) {
      setShowOriginal(!showOriginal);
      return;
    }
    setTranslating(true);
    try {
      const data = await api.translate({ content: message.content, native_language: nativeLang });
      setTranslated(data.data);
      setShowOriginal(false);
    } catch (err) {
      console.error('Translation failed:', err);
    } finally {
      setTranslating(false);
    }
  };

  const handleDelete = () => {
    setShowMenu(false);
    if (isOwn) {
      onDelete?.(message.id, true);
    } else {
      onDelete?.(message.id, false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div className={`flex gap-2 max-w-[75%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className="flex-shrink-0 mt-1">
          <img
            src={isOwn ? user?.image : message.sender_image}
            alt=""
            className="w-8 h-8 rounded-full object-cover ring-2 ring-white/10"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="hidden w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary items-center justify-center text-white text-xs font-bold">
            {(message.sender_name || 'U')[0]}
          </div>
        </div>

        <div className="relative group">
          <motion.div
            className={`
              px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-lg
              ${isOwn
                ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-br-sm'
                : 'glass text-gray-100 rounded-bl-sm'
              }
            `}
            whileHover={{ scale: 1.01 }}
          >
            <p className="whitespace-pre-wrap break-words">
              {showOriginal ? message.content : translated || message.content}
            </p>
            {translating && (
              <span className="text-xs opacity-70 mt-1 block">Translating...</span>
            )}
          </motion.div>

          <div className={`absolute top-0 ${isOwn ? 'left-0 -translate-x-full pl-2' : 'right-0 translate-x-full pr-2'} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
            <div className="flex gap-1">
              <button
                onClick={handleTranslate}
                className="w-7 h-7 flex items-center justify-center rounded-lg glass text-gray-400 hover:text-secondary transition-colors text-xs"
                title="Translate"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m0 4h6m-6 4h6m-6 4h6" />
                </svg>
              </button>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-7 h-7 flex items-center justify-center rounded-lg glass text-gray-400 hover:text-red-400 transition-colors text-xs"
                title="More"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
                </svg>
              </button>
            </div>

            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-8 right-0 w-32 glass rounded-xl overflow-hidden z-20"
              >
                <button
                  onClick={handleDelete}
                  className="w-full px-3 py-2 text-xs text-red-400 hover:bg-white/10 flex items-center gap-2 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
