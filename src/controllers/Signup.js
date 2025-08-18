const bcrypt = require('bcrypt');
const signUpUser = require('../models/query/signup');

const { userLoginSchema } = require('../../common/validations/userLogin');
const { hashPassword } = require('../../common/hashPassword');
const { createToken } = require('../../common/jwt/sign');

const SignUp = (req, res ,next) => {
  const { body } = req;

  userLoginSchema
    .validateAsync(body)
    .then(({ password }) => {
      return hashPassword(password);
    })
    .then((hashedPass) => {
      return signUpUser({ username: req.body.username, password: hashedPass });
    })
    .then(({ rows }) => {
      const user = rows[0];
      return createToken(user);
    })
    .then((token) => {
      res.status(200).json({
        message: 'user registered successfully ',
        data: req.body,
        token,
      });
    })
    .catch((err) => {
      next(err);
    });

};

module.exports = { SignUp };
