const  pool  = require('../../database/connection'); 
const signUpUser = ({
  username,
  password,
}) => {
  return pool.query(
    `INSERT INTO users (username,  password)
       VALUES ($1, $2) RETURNING id, username`,
    [username, password]
  );
};

module.exports = signUpUser;
