const express = require('express');
const userRouter = require('./user');
const router = express.Router();

router.get('/get-users',(req, res)=>{
  res.send('this is the get users route');
});


router.use('/users', userRouter);

module.exports=router;