const { userLoginSchema } = require('../../common/validations/userLogin');
const { getUser } = require('../models/query/user');
const { comparePassword } = require('../../common/compare/comparePassword');
const { createToken } = require('../../common/jwt/sign');
const { AppError } = require('../middleware/error');

const Login = (req, res, next) => {
  const { body } = req;
  userLoginSchema
    .validateAsync(body)
    .then(({ username }) => {
      return getUser(username);
    })
    .then(({ rows }) => {
      const user = rows[0];
      if (!user) {
        throw new AppError('User not found', 404);
      }
      return comparePassword(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        throw new AppError('incorrect password', 401);
      }
      return createToken(req.body);
    })
    .then((token) => {
      res
        .status(200)
        .json({
          message: 'user logged in successfully ',
          data: req.body,
          token,
        });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { Login };
