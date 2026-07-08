const { userLoginSchema } = require('../../common/validations/userLogin');
const { getUser } = require('../models/query/login');
const { comparePassword } = require('../../common/compare/comparePassword');
const { createToken } = require('../../common/jwt/sign');
const { CustomError } = require('../middleware/error');

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
        throw new CustomError('User not found', 404);
      }
      return comparePassword(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        throw new CustomError('incorrect password', 401);
      }
      const { password, ...rest } = user;
      return createToken(rest);
    })
    .then(({payload,token}) => {

      res.cookie('token',token,{
         maxAge: 60 * 60 * 1000,
      });
      
      res.status(200).json({
        message: 'user logged in successfully ',
        data: payload,
        token,
      });
    })
    .catch((err) => {
       if (err.isJoi) { return next(new CustomError(`${err.details[0].message}`, 400)); }
      next(err);
    });
};

module.exports = { Login };
