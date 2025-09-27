const { Pool } = require('pg');
const { database } = require('../../config');


const pool= new Pool({
  connectionString: database.databaseUrl,
  ssl: { rejectUnauthorized: false }
})

module.exports = pool;
