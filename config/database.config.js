const developmentDatabaseConfig = {
  databaseUrl:
    process.env.DEV_DATABASE_URL ||
    'postgres://user:password@localhost:5432/mydatabase',
};

const productionDatabaseConfig = {
  databaseUrl:
    process.env.PROD_DATABASE_URL ||
    'postgres://user:password@localhost:5432/mydatabase',
};

const testDatabaseConfig = {
  databaseUrl:
    process.env.TEST_DATABASE_URL ||
    'postgres://user:password@localhost:5432/mydatabase',
};

const databases = {
  dev: developmentDatabaseConfig,
  prod: productionDatabaseConfig,
  test: testDatabaseConfig,
};

const environment = process.env.NODE_ENV || 'development';

module.exports = databases[environment] || databases.development;