const express = require('express');

const router = express.Router();
const profileRouter=require('./user')

router.get('/hello',(req, res)=>{
  res.send('Welcome to ChatLingua Home Page');
});

router.use(profileRouter)

module.exports=router;