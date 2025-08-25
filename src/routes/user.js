
const express = require('express');
const {Login} = require('../controllers/Login');
const { SignUp } = require('../controllers/Signup');
const { getProfile } = require("../controllers/profile");
const { postProfile } = require("../controllers/profile");
const { putProfile } = require("../controllers/profile");
const { getTranslate }=require('../controllers/Translate')
const { authenticateToken } = require('../middleware/auth');
const { addChatUser, deleteChatUser, addMessageUser, getProfilesByLanguage, getMessagesByChat_id, getAllChatsByProfile, getAllChats, getProfileByUserName, addChat_Profile, addChat_Profile_training_controller, deleteMessage, editChatName, deleteChatProfiles } = require('../controllers/Chat');
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
router.get('/chat/messages/:chat_id',authenticateToken,getMessagesByChat_id);
router.get('/chat/:profile_id',authenticateToken,getAllChatsByProfile);
router.get('/chats',authenticateToken,getAllChats);
router.get('/profiles/:username',authenticateToken,getProfileByUserName);
router.delete('/message/:id',authenticateToken,deleteMessage);
router.put('/chat/:id',authenticateToken , editChatName);
router.delete('/chat_profile',authenticateToken,deleteChatProfiles);


module.exports = router;