const express = require('express');

const router = express.Router();

router.get('/',(req, res)=>{
  res.send('Welcome to ChatLingua Home Page');
});


module.exports=router;