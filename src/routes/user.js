const express = require('express');

const usersRouter = express.Router();

usersRouter.get('/get-users', (req, res) => {
  res.json({ message: 'this is the get users route' });
});

usersRouter.get('/health-check', (req, res) => {
  console.log('Health check endpoint hit');
  res.end();
});

module.exports = usersRouter;
