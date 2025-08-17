require('env2')('.env'); // Load environment variables from .env file
// this file contains the configuration for the application


module.exports = {
  appName: 'MyApp',
  version: '1.0.0',
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'defaultsecret',
  logLevel: process.env.LOG_LEVEL || 'info',
  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5000'],
  enableCors: process.env.ENABLE_CORS === 'true',
  sessionTimeout: process.env.SESSION_TIMEOUT || 3600, // in seconds
};