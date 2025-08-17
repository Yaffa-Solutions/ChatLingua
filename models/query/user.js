const connection = require('../../database/connection');

const getUser = (username) => {
  return connection.query(`select * from users where username=$1`, [username]);
};

module.exports = { getUser };
