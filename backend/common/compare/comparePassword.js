const bcrypt = require('bcrypt');
const comparePassword = (password, hashPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hashPassword, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

module.exports = { comparePassword };