const bcrypt = require('bcrypt');
const signUpUser = require('../../models/query/signUpUser');
require('dotenv').config();

const saltRounds = parseInt(process.env.SALT_ROUNDS || '10', 10);

const authSignUp = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }

  bcrypt
    .hash(password, saltRounds)
    .then(hashed => {
      return signUpUser({
        username,
        password: hashed
      });
    })
    .then(result => {
      return res.status(201).json({
        message: 'User registered successfully',
        user: result.rows && result.rows[0]
      });
    })
    .catch(err => {
      if (err && err.code === '23505') {
        return res.status(409).json({ error: 'Username is already taken' });
      }
      console.error(err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    });
};

module.exports = { authSignUp };
