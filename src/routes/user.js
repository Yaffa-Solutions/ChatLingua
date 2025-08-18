
const express = require('express');
const {Login} = require('../controllers/Login');
const { SignUp } = require('../controllers/signup');
const router = express.Router();

router.post('/login',Login);
router.post('/register',SignUp);


module.exports = router;