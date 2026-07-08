import { useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function MessageBubble({ message, isOwn, nativeLang, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const [translated, setTranslated] = useState(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [correctionRevealed, setCorrectionRevealed] = useState(false);
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

  const mockCorrection = isOwn && message.content.includes(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 4, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.18 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}
    >
      <div className={`flex gap-1.5 max-w-[65%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className="flex-shrink-0 mt-1">
          <img
            src={isOwn ? user?.image : message.sender_image}
            alt=""
            className="w-6 h-6 rounded-full object-cover ring-2 ring-white/20"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="hidden w-8 h-8 rounded-full bg-marigold items-center justify-center text-ink text-xs font-bold">
            {(message.sender_name || 'U')[0]}
          </div>
        </div>

        <div className="relative group">
          <motion.div
            className={isOwn ? 'bubble-learner' : 'bubble-native'}
            onClick={() => isOwn && mockCorrection && setCorrectionRevealed(!correctionRevealed)}
            whileTap={isOwn && mockCorrection ? { scale: 0.98 } : {}}
          >
            <p className="whitespace-pre-wrap break-words">
              {showOriginal ? message.content : translated || message.content}
            </p>
            {translating && (
              <span className="text-caption opacity-70 mt-1 block">Translating...</span>
            )}
          </motion.div>

          {isOwn && mockCorrection && correctionRevealed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={{ duration: 0.18 }}
              className="bubble-correction"
            >
              <p>
                <span className="strike-correction">{message.content.split(' ').slice(0, 2).join(' ')}</span>
                {' '}
                <span className="text-replacement">{message.content.split(' ').slice(0, 3).join(' ')}</span>
              </p>
              <p className="text-phonetic text-ink-70 mt-1">
                /kɔ.rɛk.sjɔ̃/ · natural fix, tap to hide
              </p>
            </motion.div>
          )}

          <div className={`absolute top-0 ${isOwn ? 'left-0 -translate-x-full pl-2' : 'right-0 translate-x-full pr-2'} opacity-0 group-hover:opacity-100 transition-opacity duration-150`}>
            <div className="flex gap-1">
              <button
                onClick={handleTranslate}
                className="w-7 h-7 flex items-center justify-center rounded-sm bg-white border border-stone-line text-ink-40 hover:text-marigold transition-colors"
                title="Translate"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m0 4h6m-6 4h6m-6 4h6" />
                </svg>
              </button>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-7 h-7 flex items-center justify-center rounded-sm bg-white border border-stone-line text-ink-40 hover:text-redline transition-colors"
                title="More"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
                </svg>
              </button>
            </div>

            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-8 right-0 w-32 bg-white rounded-sm border border-stone-line shadow-sm overflow-hidden z-20"
              >
                <button
                  onClick={handleDelete}
                  className="w-full px-3 py-2 text-caption text-redline hover:bg-paper/50 flex items-center gap-2 transition-colors"
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
