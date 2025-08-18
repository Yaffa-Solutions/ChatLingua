const express = require("express");
const { join } = require("path");
const  config  = require("./config");
const app = express();

const routes = require("./src/routes");
const { errorHandler } = require("./src/middleware/error");

app.use(express.json());
app.use(express.static(join(__dirname, "./public")));

app.set("port", config.app.port || 5000);
app.use(routes);

app.use(errorHandler);
module.exports = app;
