const connection = require("../../database/connection");

const addUser = ({
  username,
  password,
}) => {
  return connection.query(
    `INSERT INTO users (username,  password)
       VALUES ($1, $2) RETURNING id, username`,
    [username, password]
  );
};

module.exports = addUser;