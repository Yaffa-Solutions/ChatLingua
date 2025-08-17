require('env2')('.env'); // Load environment variables from .env file


module.exports = {
  appName: 'ChatLingua',
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'defaultsecret',
};