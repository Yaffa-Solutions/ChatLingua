const { Pool } = require('pg');

const { app } = require('../config/index');

const pool= new Pool({
  connectionString: app.database,
})

module.exports = pool;
