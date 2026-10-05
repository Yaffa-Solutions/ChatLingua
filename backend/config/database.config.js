const developmentDatabaseConfig = {
  databaseUrl:
    process.env.DEV_DATABASE_URL ||
    process.env.DB_URL ||
    'postgres://user:password@localhost:5432/mydatabase',
};

const productionDatabaseConfig = {
  databaseUrl: process.env.PROD_DATABASE_URL || 'postgresql://neondb_owner:npg_3xJaNL7Kwklo@ep-icy-leaf-aypavh36-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require&connect_timeout=60',
};

const testDatabaseConfig = {
  databaseUrl: process.env.TEST_DATABASE_URL || process.env.TEST_DB_URL,
};

const databases = {
  dev: developmentDatabaseConfig,
  prod: productionDatabaseConfig,
  test: testDatabaseConfig,
};

const environment =
  process.env.NODE_ENV === 'production'
    ? 'prod'
    : process.env.NODE_ENV === 'test'
      ? 'test'
      : 'dev';

if (environment === 'prod' && !productionDatabaseConfig.databaseUrl) {
  throw new Error(
    'PROD_DATABASE_URL or DATABASE_URL must be configured in production',
  );
}
if (environment === 'test' && !testDatabaseConfig.databaseUrl) {
  throw new Error(
    'TEST_DATABASE_URL or TEST_DB_URL must be configured for tests',
  );
}

module.exports = databases[environment] || databases.dev;
