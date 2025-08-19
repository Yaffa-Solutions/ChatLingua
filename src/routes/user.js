
const express = require('express');
const {Login} = require('../controllers/Login');
const { SignUp } = require('../controllers/signup');
const { getProfile } = require("../controllers/profile");
const { postProfile } = require("../controllers/profile");
const { putProfile } = require("../controllers/profile");
const { getTranslate }=require('../controllers/Translate')
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.post('/login',Login);
router.post('/register',SignUp);

router.get("/profile",authenticateToken ,getProfile);
router.post("/profile",authenticateToken,postProfile);
router.put("/profile",authenticateToken,putProfile)

router.get('/translate',getTranslate)

module.exports = router;