const express = require('express');

const router = express.Router();
const routerUser = require('../routes/user');

router.use(routerUser)

module.exports=router;