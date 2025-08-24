const addUser = require('../models/query/signup');
const { CustomError } = require('../middleware/error');

const { userLoginSchema } = require('../../common/validations/userLogin');
const { hashPassword } = require('../../common/hashPassword');
const { createToken } = require('../../common/jwt/sign');

const SignUp = (req, res ,next) => {
  const { body } = req;
  let user;
  userLoginSchema
    .validateAsync(body)
    .then(({ password }) => {
      return hashPassword(password);
    })
    .then((hashedPass) => {
      return addUser({ username: req.body.username, password: hashedPass });
    })
    .then(({ rows }) => {
       user = rows[0];
      return createToken(user);
    })
    .then(({token}) => {
      
      res.cookie('token',token,{
         maxAge: 60 * 60 * 1000,
      });
      
      res.status(201).json({
        message: 'user registered successfully ',
        data: user,
        token,
      });
    })
    .catch((err) => {
      if (err.isJoi) { return next(new CustomError (`${err.details[0].message}`, 400)); }
      next(err);
    });

};

module.exports = { SignUp };
