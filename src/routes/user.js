
const express = require('express');
const {Login} = require('../controllers/Login');
const { SignUp } = require('../controllers/signup');
const { getProfile } = require("../controllers/profile");
const { postProfile } = require("../controllers/profile");
const { putProfile } = require("../controllers/profile");
const { authenticateToken } = require('../middleware/auth');
const { addChatUser, deleteChatUser, addMessageUser, getProfilesByLanguage, getMessagesByChat_id } = require('../controllers/Chat');
const router = express.Router();

router.post('/login',Login);
router.post('/register',SignUp);

router.get("/profile",authenticateToken ,getProfile);
router.post("/profile",authenticateToken,postProfile);
router.put("/profile",authenticateToken,putProfile)

router.post('/chat',authenticateToken,addChatUser);

router.delete('/chat/:id',authenticateToken,deleteChatUser);
router.post('/chat/message',authenticateToken,addMessageUser);
router.get('/chat/profiles/:id',getProfilesByLanguage);
router.get('/chat/messages/:chat_id',getMessagesByChat_id);

module.exports = router;