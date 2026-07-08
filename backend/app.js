const express = require("express");
const { join } = require("path");
const  config  = require("./config");

const app = express();

const routes = require("./src/routes");
const { errorHandler } = require("./src/middleware/error");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "./public")));

app.set("port", config.app.port || 5000);

app.use(routes);

// Serve frontend build in production
const frontendDist = join(__dirname, "..", "frontend", "dist");
app.use(express.static(frontendDist));
app.get("*", (_req, res) => {
  res.sendFile(join(frontendDist, "index.html"));
});

app.use(errorHandler);

module.exports = app;
