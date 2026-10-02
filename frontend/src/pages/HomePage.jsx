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
  const { user, logout, checkAuth } = useAuth();
  const { socket, emit, on, off } = useSocket(Boolean(user));
  const {
    messages,
    setMessages,
    loading: messagesLoading,
    typingUser,
    setTypingUser,
    loadMessages,
    sendMessage,
    addMessage,
    removeMessage,
    handleTyping,
  } = useChat(socket);

  const [profiles, setProfiles] = useState([]);
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const [chatOpening, setChatOpening] = useState(false);
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
        const nextProfiles = (data?.data?.profiles || []).filter(
          (profile) =>
            String(profile.user_id ?? profile.userId) !== String(user.id),
        );
        setProfiles(nextProfiles);
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

  const selectProfile = useCallback(
    async (profile) => {
      if (
        !profile ||
        String(profile.user_id ?? profile.userId) === String(user?.id)
      ) {
        return;
      }

      setMessages([]);
      setChatOpening(true);
      setActiveChat({
        id: null,
        name: profile.username,
        image: profile.image,
        lang: `Native ${['', 'Arabic', 'English', 'French', 'Spanish', 'German', 'Turkish'][profile.native_language_id] || 'Unknown'}`,
        myId: user?.id,
        username: profile.username,
        receiverId: profile.id,
      });

      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }

      try {
        const data = await api.createChat({
          name: 'Chat',
          username: profile.username,
        });
        const chatId = data.data?.chat?.id ?? data.data?.[0]?.chat_id;
        if (!chatId) throw new Error('Chat response did not include an id');

        currentChatIdRef.current = chatId;

        emit('UserJoin', user?.username, chatId);

        setActiveChat((current) =>
          current?.receiverId === profile.id
            ? { ...current, id: chatId }
            : current,
        );
        await loadMessages(chatId);
      } catch (err) {
        console.error('Failed to select profile:', err);
        setActiveChat(null);
        setMessages([]);
      } finally {
        setChatOpening(false);
      }
    },
    [user, emit, loadMessages, setMessages],
  );

  const handleSendMessage = useCallback(
    async (content) => {
      if (!activeChat) return;
      try {
        await sendMessage(activeChat.id, content, activeChat.receiverId);
      } catch (err) {
        console.error('Failed to send message:', err);
      }
    },
    [activeChat, user, sendMessage],
  );

  const handleTypingEmit = useCallback(() => {
    if (activeChat) {
      emit('typing', user?.username, activeChat.id);
    }
  }, [activeChat, user, emit]);

  const handleDeleteMessage = useCallback(
    async (messageId, isOwn) => {
      if (isOwn) {
        try {
          await api.deleteMessage(messageId);
          removeMessage(messageId);
        } catch (err) {
          try {
            await api.removeMessageFor(messageId);
            removeMessage(messageId);
          } catch (e) {
            console.error('Failed to delete message:', e);
          }
        }
      } else {
        try {
          await api.removeMessageFor(messageId);
          removeMessage(messageId);
        } catch (err) {
          console.error('Failed to delete message:', err);
        }
      }
    },
    [activeChat, user, emit, removeMessage],
  );

  const handleDeleteChat = useCallback(async () => {
    if (!activeChat) return;
    try {
      await api.deleteChat(activeChat.id);
      emit('deleteChat', { chat_id: activeChat.id });
      setMessages([]);
      setActiveChat(null);
    } catch (err) {
      try {
        await api.deleteChatForProfile(activeChat.id);
        setMessages([]);
        setActiveChat(null);
      } catch (e) {
        console.error('Failed to delete chat:', e);
      }
    }
  }, [activeChat, user, emit]);

  const handleUpdateProfile = useCallback(() => checkAuth(), [checkAuth]);

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
          loading={messagesLoading || chatOpening}
          typingUser={typingUser}
          onSend={handleSendMessage}
          onTyping={handleTypingEmit}
          onDeleteMessage={handleDeleteMessage}
          onDeleteChat={handleDeleteChat}
        />
      </motion.div>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        profile={user}
        onUpdate={handleUpdateProfile}
        onLogout={logout}
      />
    </div>
  );
}
