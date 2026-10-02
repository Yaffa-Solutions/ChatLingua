const { Pool } = require('pg');
const { database } = require('../../config');

const connectionString = database.databaseUrl;
const isRemoteDatabase =
  !!connectionString &&
  !connectionString.includes('localhost') &&
  !connectionString.includes('127.0.0.1');

const pool = new Pool({
  connectionString,
  ssl: isRemoteDatabase ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
