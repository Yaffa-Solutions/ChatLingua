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

  register: (data) =>
    request('/register', { method: 'POST', body: data }),

  getProfile: () =>
    request('/profile'),

  createProfile: (data) =>
    request('/profile', { method: 'POST', body: data }),

  updateProfile: (data) =>
    request('/profile', { method: 'PUT', body: data }),

  // Chats
  getProfiles: (learnId) =>
    request(`/chat/profiles/${learnId}`),

  getChatMessages: (chatId, profileId) =>
    request(`/chat/messages?chat_id=${chatId}&profile_id=${profileId}`),

  checkChat: (chatId, profileId) =>
    request(`/checkChat?chat_id=${chatId}&profile_id=${profileId}`),

  createChat: (data) =>
    request('/chat', { method: 'POST', body: data }),

  deleteChat: (chatId) =>
    request(`/chat/${chatId}`, { method: 'DELETE' }),

  deleteChatForProfile: (data) =>
    request('/chat_profile', { method: 'PUT', body: data }),

  updateChatName: (chatId, data) =>
    request(`/chat/${chatId}`, { method: 'PUT', body: data }),

  // Messages
  sendMessage: (data) =>
    request('/chat/message', { method: 'POST', body: data }),

  removeMessageFor: (data) =>
    request('/removeMessageFor', { method: 'PUT', body: data }),

  deleteMessage: (messageId) =>
    request(`/message/${messageId}`, { method: 'DELETE' }),

  translate: (data) =>
    request('/translate', { method: 'POST', body: data }),

  restoreChat: (chatId, profileId) =>
    request(`/restoreChat?chat_id=${chatId}&profile_id=${profileId}`),

  getProfileByUsername: (username) =>
    request(`/profiles/${username}`),
};
