require('env2')('.env'); // Load environment variables from .env file
// this file contains the configuration for the application


module.exports = {
  appName: 'ChatLingua',
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'defaultsecret',
  SALT_ROUNDS:process.env.SALT_ROUNDS || '10',
  G_API_KEY:process.env.G_API_KEY
};