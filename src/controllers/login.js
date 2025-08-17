const { getUser } = require('../../models/query/user');
const { userLoginSchema } = require('../../common/validations/userLogin');
const { createToken } = require('../../common/jwt/sign');
const { comparePassword } = require('../../common/compare/comparePassword');

const login = (req, res, next) => {
  const { body } = req;
  userLoginSchema
    .validateAsync(body)
    .then(({ username }) => {
      return getUser(username);
    })
    .then((user) => {
      return comparePassword(req.body.password, user.rows[0].password);
    })
    .then((result) => {
      if (!result) {
        throw new Error('incorrect password');
      }
      return createToken(req.body);
    })
    .then((token) => {
      res.status(200).json({
        message: 'user logged in successfully',
        data: req.body,
        token,
      });
    })
    .catch((err) => {
      console.log('err: ', err);
      next(err);
    });
};

module.exports = { login };
