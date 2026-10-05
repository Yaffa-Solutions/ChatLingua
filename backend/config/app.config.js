const path = require('path');
const fs = require('fs');
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  require('env2')(envPath);
}
// this file contains the configuration for the application

// if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
//   throw new Error('JWT_SECRET must be configured in production');
// }

module.exports = {
  appName: 'ChatLingua',
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'development-only-secret',
  SALT_ROUNDS:process.env.SALT_ROUNDS || '10',
  G_API_KEY:process.env.G_API_KEY
};