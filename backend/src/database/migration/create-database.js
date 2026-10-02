const { readFileSync } = require('fs');
const { join } = require('path');
const { Pool } = require('pg');

const { database } = require('../../../config');

const sql = readFileSync(join(__dirname, '../build.sql'), 'utf-8');

const buildDatabaseConnection = () => {
  const connectionString = database.databaseUrl;
  const isRemoteDatabase =
    !!connectionString &&
    !connectionString.includes('localhost') &&
    !connectionString.includes('127.0.0.1');

  return new Pool({
    connectionString,
    ssl: isRemoteDatabase ? { rejectUnauthorized: false } : false,
  });
};

const createDatabaseIfMissing = async () => {
  const connectionString = database.databaseUrl;

  if (!connectionString) {
    throw new Error('Database URL is not configured.');
  }

  const targetUrl = new URL(connectionString);
  const targetDatabaseName = targetUrl.pathname.replace(/^\//, '');

  if (!targetDatabaseName) {
    throw new Error('Database name could not be determined from DATABASE_URL.');
  }

  const adminUrl = new URL(connectionString);
  adminUrl.pathname = '/postgres';

  const adminPool = new Pool({
    connectionString: adminUrl.toString(),
    ssl:
      adminUrl.hostname !== 'localhost' && adminUrl.hostname !== '127.0.0.1'
        ? { rejectUnauthorized: false }
        : false,
  });

  try {
    const client = await adminPool.connect();
    const result = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [targetDatabaseName],
    );

    if (result.rowCount === 0) {
      await client.query(`CREATE DATABASE "${targetDatabaseName}"`);
      console.log(`Created database: ${targetDatabaseName}`);
    }

    client.release();
  } finally {
    await adminPool.end();
  }
};

(async () => {
  try {
    await createDatabaseIfMissing();
    const connection = buildDatabaseConnection();
    await connection.query(sql);
    console.log('build created successfully!');
    await connection.end();
  } catch (error) {
    console.error(
      'failed to build',
      error && error.stack ? error.stack : error,
    );
    process.exitCode = 1;
  }
})();
