const bcrypt = require('bcrypt');

const comparePassword = (password, hashedPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hashedPassword, function (err, result) {
      if (err) {
        reject(err);
        throw new Error('incorrect password');
      } else return resolve(result);
    });
  });
};

module.exports = { comparePassword };
