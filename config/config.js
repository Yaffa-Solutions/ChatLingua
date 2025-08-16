require("env2")(".env");

const app = {};
app.port = process.env.PORT || 5000;
app.database = DB_URL || "Database Url";

module.exports = { app };
