
const express = require('express');
const {Login} = require('../controllers/Login');
const { SignUp } = require('../controllers/Signup');
const { getProfile } = require("../controllers/profile");
const { postProfile } = require("../controllers/profile");
const { putProfile } = require("../controllers/profile");
const { getTranslate }=require('../controllers/Translate')
const { authenticateToken } = require('../middleware/auth');
const { addChatUser, deleteChatUser, addMessageUser, getProfilesByLanguage, getMessagesByChat_id, getAllChatsByProfile, getAllChats, getProfileByUserName, deleteMessage, editChatName, deleteChatForProfile, checkIsDeletedChat, restoreDeletedChat, deleteMessageFor } = require('../controllers/Chat');
const router = express.Router();

router.post('/api/login',Login);
router.post('/api/register',SignUp);

router.get("/api/profile",authenticateToken ,getProfile);
router.post("/api/profile",authenticateToken,postProfile);
router.put("/api/profile",authenticateToken,putProfile)

router.post('/api/translate',getTranslate)

router.post('/api/chat',authenticateToken,addChatUser);
router.delete('/api/chat/:id',authenticateToken,deleteChatUser);
router.post('/api/chat/message',authenticateToken,addMessageUser);
router.get('/api/chat/profiles/:id',authenticateToken , getProfilesByLanguage);
router.get('/api/chat/messages',authenticateToken,getMessagesByChat_id);
router.get('/api/chat/:profile_id',authenticateToken,getAllChatsByProfile);
router.get('/api/chats',authenticateToken,getAllChats);
router.get('/api/profiles/:username',authenticateToken,getProfileByUserName);
router.delete('/api/message/:id',authenticateToken,deleteMessage);
router.put('/api/chat/:id',authenticateToken , editChatName);
router.put('/api/chat_profile',authenticateToken,deleteChatForProfile);
router.get('/api/checkChat',authenticateToken,checkIsDeletedChat);
router.get('/api/restoreChat',authenticateToken,restoreDeletedChat);

router.put('/api/removeMessageFor',authenticateToken,deleteMessageFor)
module.exports = router;