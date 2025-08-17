const express = require("express");
const  config = require("./config");
const app = express();

const routes = require("./src/routes");

app.use(express.json());
// app.use(express.static(join(__dirname, "./public")));

app.set("port", config.app.port || 5000);
app.use(routes);

module.exports = app;
