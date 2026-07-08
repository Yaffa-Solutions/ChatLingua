const jwt = require("jsonwebtoken");
const {app}=require('../../config')
const path = require('path');
const fs = require('fs');
const envPath = path.join(__dirname, '..', '..', '.env');
if (fs.existsSync(envPath)) {
  require("env2")(envPath);
}

const JWT_SECRET = app.jwtSecret;
const authenticateToken = (req, res, next) => {
   // const authHeader = req.headers["authorization"];
  //const token = authHeader && authHeader.split(" ")[1];
  const token =req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ err });
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
