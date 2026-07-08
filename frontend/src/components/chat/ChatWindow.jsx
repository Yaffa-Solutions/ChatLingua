import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import TypingIndicator from './TypingIndicator';
import EmptyState from './EmptyState';
import Skeleton from '../ui/Skeleton';

export default function ChatWindow({
  activeChat,
  messages,
  loading,
  typingUser,
  onSend,
  onTyping,
  onDeleteMessage,
  onDeleteChat,
  nativeLang,
}) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <EmptyState />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col h-full p-3 gap-3"
    >
      <ChatHeader
        receiver={activeChat}
        onDeleteChat={() => onDeleteChat?.(activeChat)}
      />

      <div className="flex-1 overflow-y-auto bg-white border border-stone-line rounded-md p-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 ${i % 2 === 0 ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Skeleton variant="avatar" className="w-8 h-8" />
                  <Skeleton className={`h-12 ${i % 2 === 0 ? 'w-48' : 'w-36'}`} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((msg, i) => (
              <MessageBubble
                key={msg.id || i}
                message={msg}
                isOwn={msg.sender_id === activeChat.myId}
                nativeLang={nativeLang}
                onDelete={onDeleteMessage}
              />
            ))}
          </AnimatePresence>
        )}

        <TypingIndicator username={typingUser} />

        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        onSend={onSend}
        onTyping={onTyping}
        disabled={!activeChat}
      />
    </motion.div>
  );
}
