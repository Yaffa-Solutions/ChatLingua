const bcrypt = require('bcrypt');
const { app } = require('../../config');
const saltRounds = parseInt(app.SALT_ROUNDS, 10);
const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password,saltRounds, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

module.exports = {  hashPassword };