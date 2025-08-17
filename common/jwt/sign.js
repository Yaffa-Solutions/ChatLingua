const jwt = require('jsonwebtoken');
const { app } = require('../../config');

const createToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, app.jwtSecret, function (err, token) {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

module.exports = { createToken };
