const express = require('express');

const router = express.Router();
const routerUser = require('../routes/user');
const routerProfile=require('./user')

router.use(routerUser)
router.use(routerProfile)

module.exports=router;