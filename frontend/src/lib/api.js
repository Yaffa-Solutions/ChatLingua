const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const config = {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || 'Request failed');
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) =>
    request('/login', { method: 'POST', body: credentials }),

  logout: () => request('/logout', { method: 'POST' }),

  register: (data) => request('/register', { method: 'POST', body: data }),

  getProfile: () => request('/profile'),

  createProfile: (data) => request('/profile', { method: 'POST', body: data }),

  updateProfile: (data) => request('/profile', { method: 'PUT', body: data }),

  // Chats
  getProfiles: (learnId) => request(`/chat/profiles/${learnId}`),

  getChatMessages: (chatId) => request(`/chat/messages?chat_id=${chatId}`),

  checkChat: (chatId) => request(`/checkChat?chat_id=${chatId}`),

  createChat: (data) => request('/chat', { method: 'POST', body: data }),

  deleteChat: (chatId) => request(`/chat/${chatId}`, { method: 'DELETE' }),

  deleteChatForProfile: (chatId) =>
    request('/chat_profile', { method: 'PUT', body: { chat_id: chatId } }),

  updateChatName: (chatId, data) =>
    request(`/chat/${chatId}`, { method: 'PUT', body: data }),

  // Messages
  sendMessage: (data) =>
    request('/chat/message', { method: 'POST', body: data }),

  removeMessageFor: (messageId) =>
    request('/removeMessageFor', {
      method: 'PUT',
      body: { message_id: messageId },
    }),

  deleteMessage: (messageId) =>
    request(`/message/${messageId}`, { method: 'DELETE' }),

  translate: (data) => request('/translate', { method: 'POST', body: data }),

  getProfileByUsername: (username) => request(`/profiles/${username}`),
};
