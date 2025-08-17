require("env2")(".env");

const app = {};
let database = "";

console.log('proce',process.env.NODE_ENV == 'dev')
console.log('env',process.env.NODE_ENV)
console.log('url',process.env.DB_URL)
if (process.env.NODE_ENV === 'TEST') {
  database = process.env.TEST_DB_URL;
} else if (process.env.NODE_ENV === 'dev') {
  database = process.env.DB_URL;
  console.log('dataDev')
}

console.log({database})
app.port = process.env.PORT || 5000;
app.database = database;

module.exports = { app };
