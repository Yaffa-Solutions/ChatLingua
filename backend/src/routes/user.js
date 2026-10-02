const express = require('express');
const { Login, Logout } = require('../controllers/Login');
const { SignUp } = require('../controllers/Signup');
const { getProfile } = require('../controllers/profile');
const { postProfile } = require('../controllers/profile');
const { putProfile } = require('../controllers/profile');
const { getTranslate } = require('../controllers/Translate');
const { authenticateToken } = require('../middleware/auth');
const {
  addChatUser,
  deleteChatUser,
  addMessageUser,
  getProfilesByLanguage,
  getMessagesByChat_id,
  getAllChatsByProfile,
  getAllChats,
  getProfileByUserName,
  deleteMessage,
  editChatName,
  deleteChatForProfile,
  checkIsDeletedChat,
  restoreDeletedChat,
  deleteMessageFor,
} = require('../controllers/Chat');
const router = express.Router();

// Legacy routes required by the existing tests and older frontend/client code.
router.post('/login', Login);
router.post('/logout', Logout);
router.post('/register', SignUp);
router.get('/profile', authenticateToken, getProfile);
router.post('/profile', authenticateToken, postProfile);
router.put('/profile', authenticateToken, putProfile);
router.post('/translate', authenticateToken, getTranslate);
router.post('/chat', authenticateToken, addChatUser);
router.delete('/chat/:id', authenticateToken, deleteChatUser);
router.post('/chat/message', authenticateToken, addMessageUser);
router.get('/chat/profiles/:id', authenticateToken, getProfilesByLanguage);
router.get('/chat/messages', authenticateToken, getMessagesByChat_id);
router.get('/chat/:profile_id', authenticateToken, getAllChatsByProfile);
router.get('/chats', authenticateToken, getAllChats);
router.get('/profiles/:username', authenticateToken, getProfileByUserName);
router.delete('/message/:id', authenticateToken, deleteMessage);
router.put('/chat/:id', authenticateToken, editChatName);
router.put('/chat_profile', authenticateToken, deleteChatForProfile);
router.get('/checkChat', authenticateToken, checkIsDeletedChat);
router.get('/restoreChat', authenticateToken, restoreDeletedChat);
router.put('/removeMessageFor', authenticateToken, deleteMessageFor);

// Current API contract used by the Vite frontend.
router.post('/api/login', Login);
router.post('/api/logout', Logout);
router.post('/api/register', SignUp);
router.get('/api/profile', authenticateToken, getProfile);
router.post('/api/profile', authenticateToken, postProfile);
router.put('/api/profile', authenticateToken, putProfile);
router.post('/api/translate', authenticateToken, getTranslate);
router.post('/api/chat', authenticateToken, addChatUser);
router.delete('/api/chat/:id', authenticateToken, deleteChatUser);
router.post('/api/chat/message', authenticateToken, addMessageUser);
router.get('/api/chat/profiles/:id', authenticateToken, getProfilesByLanguage);
router.get('/api/chat/messages', authenticateToken, getMessagesByChat_id);
router.get('/api/chat/messages/:id', authenticateToken, getMessagesByChat_id);
router.get('/api/chat/:profile_id', authenticateToken, getAllChatsByProfile);
router.get('/api/chats', authenticateToken, getAllChats);
router.get('/api/profiles/:username', authenticateToken, getProfileByUserName);
router.delete('/api/message/:id', authenticateToken, deleteMessage);
router.put('/api/chat/:id', authenticateToken, editChatName);
router.put('/api/chat_profile', authenticateToken, deleteChatForProfile);
router.get('/api/checkChat', authenticateToken, checkIsDeletedChat);
router.get('/api/restoreChat', authenticateToken, restoreDeletedChat);
router.put('/api/removeMessageFor', authenticateToken, deleteMessageFor);

router.get('/chat/messages/:id', authenticateToken, getMessagesByChat_id);

module.exports = router;
