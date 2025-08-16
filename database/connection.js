const { Pool } = require('pg');
require('env2')('.env');

const { app } = require('../config/config');

module.exports = new Pool({
  connectionString: app.database,
})