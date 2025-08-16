const express = require('express');
const { join } = require('path'); 
const app = express();

const routes = require('./src/routes/index');

app.use(express.json());
app.use(express.static(join(__dirname,"./public")));

app.set("port",process.env.PORT||5000);
app.use('/', routes);

module.exports = app;