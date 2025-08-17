const router = require('express').Router();
const { authSignUp } = require('../controllers/signup');

router.post('/signup', authSignUp);

module.exports = router;