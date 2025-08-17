const express = require("express");
const { join } = require("path");
const { config } = require("./config/index");
const app = express();

const routes = require("./src/routes/index");

app.use(express.json());
app.use(express.static(join(__dirname, "./public")));

app.set("port", config.port || 5000);
app.use(routes);

module.exports = app;
