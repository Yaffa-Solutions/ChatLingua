
const express = require('express');
const {Login} = require('../controllers/Login');
const { SignUp } = require('../controllers/Signup');
const { getProfile } = require("../controllers/profile");
const { postProfile } = require("../controllers/profile");
const { putProfile } = require("../controllers/profile");
const { getTranslate }=require('../controllers/Translate')
const { authenticateToken } = require('../middleware/auth');
const { addChatUser, deleteChatUser, addMessageUser, getProfilesByLanguage, getMessagesByChat_id, getAllChatsByProfile, getAllChats, getProfileByUserName, deleteMessage, editChatName, deleteChatForProfile, checkIsDeletedChat, restoreDeletedChat } = require('../controllers/Chat');
const router = express.Router();

router.post('/login',Login);
router.post('/register',SignUp);

router.get("/profile",authenticateToken ,getProfile);
router.post("/profile",authenticateToken,postProfile);
router.put("/profile",authenticateToken,putProfile)

router.post('/translate',getTranslate)

router.post('/chat',authenticateToken,addChatUser);
router.delete('/chat/:id',authenticateToken,deleteChatUser);
router.post('/chat/message',authenticateToken,addMessageUser);
router.get('/chat/profiles/:id',authenticateToken , getProfilesByLanguage);
router.get('/chat/messages',authenticateToken,getMessagesByChat_id);
router.get('/chat/:profile_id',authenticateToken,getAllChatsByProfile);
router.get('/chats',authenticateToken,getAllChats);
router.get('/profiles/:username',authenticateToken,getProfileByUserName);
router.delete('/message/:id',authenticateToken,deleteMessage);
router.put('/chat/:id',authenticateToken , editChatName);
router.put('/chat_profile',authenticateToken,deleteChatForProfile);
router.get('/checkChat',authenticateToken,checkIsDeletedChat);
router.get('/restoreChat',authenticateToken,restoreDeletedChat);

module.exports = router;