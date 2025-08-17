const { Pool } = require('pg');

const { app } = require('../config');
console.log('app: ', app);

const pool= new Pool({
  connectionString: app.database,
})

module.exports = pool;
