import { useState, useCallback, useRef, useEffect } from 'react';
import { api } from '../lib/api';

export function useChat(socket) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const typingTimeout = useRef(null);

  const loadMessages = useCallback(async (chatId, profileId) => {
    setLoading(true);
    try {
      const data = await api.getChatMessages(chatId, profileId);
      setMessages(data?.data?.messages || []);
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (chatId, content, senderId, receiverId, senderImage) => {
    try {
      const data = await api.sendMessage({
        chat_id: chatId,
        content,
        sender_id: senderId,
        receiver_id: receiverId,
      });
      const newMsg = data?.data?.messages;
      if (newMsg) {
        socket?.current?.emit('sendMessage', {
          messageId: newMsg.id,
          chat_id: chatId,
          content,
          sender_id: senderId,
          receiver_id: receiverId,
          sender_image: senderImage,
        });
        setMessages(prev => [...prev, newMsg]);
      }
      return newMsg;
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  }, [socket]);

  const addMessage = useCallback((msg) => {
    setMessages(prev => {
      if (prev.some(m => m.id === msg.messageId)) return prev;
      return [...prev, {
        id: msg.messageId,
        content: msg.content,
        sender_id: msg.sender_id,
        sender_image: msg.sender_image,
        chat_id: msg.chat_id,
      }];
    });
  }, []);

  const removeMessage = useCallback((messageId) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
  }, []);

  const handleTyping = useCallback((username) => {
    setTypingUser(username);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => setTypingUser(''), 1500);
  }, []);

  useEffect(() => {
    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, []);

  return {
    messages, setMessages,
    loading,
    typingUser, setTypingUser,
    loadMessages,
    sendMessage,
    addMessage,
    removeMessage,
    handleTyping,
  };
}
