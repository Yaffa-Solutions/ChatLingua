const { userLoginSchema } = require('../../common/validations/userLogin');
const { getUser } = require('../models/query/user');
const { comparePassword } = require('../../common/compare/comparePassword');
const { createToken } = require('../../common/jwt/sign');
const { AppError } = require('../middleware/error');

const Login = (req, res, next) => {
  const { body } = req;
  let user;
  userLoginSchema
    .validateAsync(body)
    .then(({ username }) => {
      return getUser(username);
    })
    .then(({ rows }) => {
      user = rows[0];
      if (!user) {
        throw new AppError('User not found', 404);
      }
      return comparePassword(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        throw new AppError('incorrect password', 401);
      }
      const { password, ...rest } = user;
      return createToken(rest);
    })
    .then(({payload,token}) => {
      res.status(200).json({
        message: 'user logged in successfully ',
        data: payload,
        token,
      });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { Login };
