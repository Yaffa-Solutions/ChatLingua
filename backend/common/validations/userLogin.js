const Joi = require('joi');
const schema = Joi.object({
  username: Joi.string()
    .pattern(/^[A-Za-z0-9_]{3,20}$/)
    .required(),
  password: Joi.string().min(6).max(128).required(),
  repeat_password: Joi.ref('password'),
});

module.exports = { userLoginSchema: schema };
