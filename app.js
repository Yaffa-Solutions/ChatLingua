const express = require('express');
const cors = require('cors');
const { join } = require('path');
require('dotenv').config();

let config = {};
try {
  config = require('./config');
} catch (_) {}

const routes = require('./src/routes'); 

const app = express();

app.set('port', process.env.PORT || (config.app && config.app.port) || 5000);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));

app.use('/api', routes);

app.get('/health', (req, res) => res.send('ok'));

app.use((req, res) => res.status(404).json({ error: 'Not Found' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
