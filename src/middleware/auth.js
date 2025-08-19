const jwt = require("jsonwebtoken");
const {app}=require('../../config')
require("env2")(".env");

const JWT_SECRET = app.jwtSecret;
const authenticateToken = (req, res, next) => {
   // const authHeader = req.headers["authorization"];
  //const token = authHeader && authHeader.split(" ")[1];
  const token =req.cookie.token;
  if (!token) return res.sendStatus(401).json({ message: "Unauthorized" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ err });
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
