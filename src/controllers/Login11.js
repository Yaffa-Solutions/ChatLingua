const userLogin = require('../../models/query/user');
const jwt = require('jsonwebtoken');
const { app } = require('../../config');

const loginController = ({ body: { username, password } }, res, next) => {
  console.log(username, password);
  userLogin(username, password)
    .then(({ rows, rowCount }) => {
      if (!rowCount) {
        throw new Error(
          res
            .status(401)
            .json({
              message: 'unauthorized --> invalid username or password',
              success: false,
              status: 401,
            })
        );
      }
      const user = rows[0];
      const { password, ...rest } = user;

      const jwtToken = jwt.sign(
        ...rest,
        app.jwtSecret,
        { expiresIn: '1h' }
      );

      res
        .status(200)
        .json({
          message: 'Login success',
          success: true,
          status: 200,
          data: { user: rest, token: jwtToken },
        });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = loginController;
