const { Pool } = require('pg');
const { database } = require('../../config');


const pool= new Pool({
  connectionString: database.databaseUrl,
})

module.exports = pool;
