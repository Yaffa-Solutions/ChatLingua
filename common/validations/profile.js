const Joi = require("joi");

const profileSchema = Joi.object({
  native_language_id: Joi.number()
    .integer()
    .valid(1, 2, 3, 4, 5, 6, 7)
    .required(),

  learning_language_id: Joi.number()
    .integer()
    .valid(1, 2, 3, 4, 5, 6, 7)
    .disallow(Joi.ref("native_language"))
    .required(),

  image: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .allow(null, "")
    .optional(),
});

module.exports = profileSchema;
