const translateMessage = require('../../common/helper');
const Joi = require('joi');
const { CustomError } = require('../middleware/error');
const { getMessageTranslationContext } = require('../models/query/chat');

const translateSchema = Joi.object({
  message_id: Joi.number().integer().positive().required(),
});

const getTranslate = (req, res, next) => {
  translateSchema
    .validateAsync(req.body)
    .then(({ message_id }) =>
      getMessageTranslationContext(message_id, req.user.id).then(({ rows }) => {
        if (!rows[0]) {
          throw new CustomError(
            'Message not found or not available to this user',
            404,
          );
        }

        const message = rows[0];
        const sender = {
          id: message.sender_id,
          nativeLanguage: message.sender_native_language,
        };
        const receiver = {
          id: message.receiver_id,
          nativeLanguage: message.receiver_native_language,
        };
        const sourceLanguage = sender.nativeLanguage;
        const targetLanguage = receiver.nativeLanguage;

        if (
          sourceLanguage !== sender.nativeLanguage ||
          targetLanguage !== receiver.nativeLanguage
        ) {
          throw new CustomError('Invalid translation language direction', 500);
        }

        if (process.env.NODE_ENV !== 'production') {
          console.info(
            '[translation-context]',
            JSON.stringify({
              sender,
              receiver,
              sourceLanguage,
              targetLanguage,
              message: message.content,
            }),
          );
        }

        if (sourceLanguage === targetLanguage) {
          return { data: null, unnecessary: true };
        }

        return translateMessage(
          message.content,
          sourceLanguage,
          targetLanguage,
        ).then((translation) => ({ data: translation }));
      }),
    )
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      if (err.isJoi) return next(new CustomError(err.details[0].message, 400));
      next(err);
    });
};

module.exports = { getTranslate };
