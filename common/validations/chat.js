const Joi = require('joi');

const idSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

const messageSchema = Joi.object({
  chat_id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'chat_id must be a number',
      'number.integer': 'chat_id must be an integer',
      'number.positive': 'chat_id must be a positive number',
      'any.required': 'chat_id is required'
    }),
  content: Joi.string().min(1).required()
    .messages({
      'string.base': 'content must be a string',
      'string.empty': 'content cannot be empty',
      'any.required': 'content is required'
    }),
  sender_id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'sender_id must be a number',
      'number.integer': 'sender_id must be an integer',
      'number.positive': 'sender_id must be positive',
      'any.required': 'sender_id is required'
    }),
  receiver_id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'receiver_id must be a number',
      'number.integer': 'receiver_id must be an integer',
      'number.positive': 'receiver_id must be positive',
      'any.required': 'receiver_id is required'
    })
});

module.exports={idSchema , messageSchema};