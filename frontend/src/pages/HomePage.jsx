import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';
import SettingsModal from './SettingsModal';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { useChat } from '../hooks/useChat';
import { api } from '../lib/api';

export default function HomePage() {
  const { user, logout } = useAuth();
  const { socket, emit, on, off } = useSocket();
  const {
    messages, setMessages,
    loading: messagesLoading,
    typingUser, setTypingUser,
    loadMessages,
    sendMessage,
    addMessage,
    removeMessage,
    handleTyping,
  } = useChat(socket);

  const [profiles, setProfiles] = useState([]);
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const currentChatIdRef = useRef(null);

  // Load profiles
  useEffect(() => {
    if (!user?.learn_id) return;
    (async () => {
      try {
        const data = await api.getProfiles(user.learn_id);
        setProfiles(data?.data?.profiles || []);
      } catch (err) {
        console.error('Failed to load profiles:', err);
      } finally {
        setProfilesLoading(false);
      }
    })();
  }, [user]);

  // Socket listeners
  useEffect(() => {
    const unsubReceive = on('receiveMessage', (msg) => {
      addMessage(msg);
    });
    const unsubRemove = on('removedMessage', ({ messageId }) => {
      removeMessage(messageId);
    });
    const unsubType = on('userTyping', ({ username }) => {
      handleTyping(username);
    });
    const unsubJoined = on('UserJoined', ({ username }) => {
      // Could show a notification
    });

    return () => {
      unsubReceive?.();
      unsubRemove?.();
      unsubType?.();
      unsubJoined?.();
    };
  }, [on, addMessage, removeMessage, handleTyping]);

  const selectProfile = useCallback(async (profile) => {
    try {
      const data = await api.createChat({
        name: 'Chat',
        username: profile.username,
      });
      const chatId = data.data[0].chat_id;

      currentChatIdRef.current = chatId;

      emit('UserJoin', user?.username, chatId);

      await loadMessages(chatId, user?.id);

      // Restore if deleted
      api.restoreChat(chatId, user?.id).catch(() => {});

      setActiveChat({
        id: chatId,
        name: profile.username,
        image: profile.image,
        lang: `Native ${['', 'Arabic', 'English', 'French', 'Spanish', 'German', 'Turkish'][profile.native_language_id] || 'Unknown'}`,
        myId: user?.id,
        username: profile.username,
        receiverId: profile.id,
      });

      // Close sidebar on mobile
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    } catch (err) {
      console.error('Failed to select profile:', err);
    }
  }, [user, emit, loadMessages]);

  const handleSendMessage = useCallback(async (content) => {
    if (!activeChat) return;
    try {
      await sendMessage(
        activeChat.id,
        content,
        user?.id,
        activeChat.receiverId,
        user?.image
      );
      api.restoreChat(activeChat.id, user?.id).catch(() => {});
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  }, [activeChat, user, sendMessage]);

  const handleTypingEmit = useCallback(() => {
    if (activeChat) {
      emit('typing', user?.username, activeChat.id);
    }
  }, [activeChat, user, emit]);

  const handleDeleteMessage = useCallback(async (messageId, isOwn) => {
    if (isOwn) {
      try {
        await api.deleteMessage(messageId);
        emit('removeMessage', { messageId, chat_id: activeChat.id });
      } catch (err) {
        try {
          await api.removeMessageFor({
            profile_id: user?.id,
            message_id: messageId,
          });
          removeMessage(messageId);
        } catch (e) {
          console.error('Failed to delete message:', e);
        }
      }
    } else {
      try {
        await api.removeMessageFor({
          profile_id: user?.id,
          message_id: messageId,
        });
        removeMessage(messageId);
      } catch (err) {
        console.error('Failed to delete message:', err);
      }
    }
  }, [activeChat, user, emit, removeMessage]);

  const handleDeleteChat = useCallback(async () => {
    if (!activeChat) return;
    try {
      await api.deleteChat(activeChat.id);
      emit('deleteChat', { chat_id: activeChat.id });
      setMessages([]);
      setActiveChat(null);
    } catch (err) {
      try {
        await api.deleteChatForProfile({
          chat_id: activeChat.id,
          profile_id: user?.id,
        });
        setMessages([]);
        setActiveChat(null);
      } catch (e) {
        console.error('Failed to delete chat:', e);
      }
    }
  }, [activeChat, user, emit]);

  const handleUpdateProfile = useCallback((form) => {
    // Profile was updated; could refresh user data
  }, []);

  const responsiveSidebar = sidebarOpen;

  return (
    <div className="h-screen flex overflow-hidden relative bg-paper">
      <Sidebar
        user={user}
        profiles={profiles}
        loading={profilesLoading}
        activeProfile={activeChat}
        onSelectProfile={selectProfile}
        onOpenSettings={() => setSettingsOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isOpen={responsiveSidebar}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <motion.div
        className="flex-1 flex flex-col relative z-10"
        layout
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <ChatWindow
          activeChat={activeChat}
          messages={messages}
          loading={messagesLoading}
          typingUser={typingUser}
          onSend={handleSendMessage}
          onTyping={handleTypingEmit}
          onDeleteMessage={handleDeleteMessage}
          onDeleteChat={handleDeleteChat}
          nativeLang={user?.native}
        />
      </motion.div>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        profile={user}
        onUpdate={handleUpdateProfile}
      />
    </div>
  );
}
