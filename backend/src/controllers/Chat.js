const { idSchema, messageSchema } = require('../../common/validations/chat');
const { CustomError } = require('../middleware/error');
const {
  addMessage,
  getProfilesByLanguageId,
  getMessages,
  getAllChatsQuery,
  getAllChatsByProfileQuery,
  addChat_ProfileQuery,
  getProfileByUserNameQuery,
  deleteMessageQuery,
  editChatNameQuery,
  deleteMessageForQuery,
  deleteChatForProfileQuery,
  checkIsDeletedChatQuery,
  restoreDeletedStatus,
} = require('../models/query/chat');
const { getProfileByUserId } = require('../models/query/profile');

const getOwnProfileId = async (userId) => {
  const { rows } = await getProfileByUserId(userId);
  if (!rows[0]) throw new CustomError('User Profile Not found', 404);
  return rows[0].id;
};

const getAllChats = (req, res, next) => {
  getOwnProfileId(req.user.id)
    .then((profileId) => getAllChatsQuery(profileId))
    .then(({ rows, rowCount }) => {
      res.status(200).json({
        message: 'these is all chats',
        status: 200,
        data: { chats: rows },
        count: rowCount,
      });
    })
    .catch((err) => {
      next(err);
    });
};

const getProfileByUserName = ({ params: { username } }, res, next) => {
  getProfileByUserNameQuery(username)
    .then(({ rows, rowCount }) => {
      res.status(200).json({
        message: `this is data profile for this username ${username}`,
        data: { profile: rows },
        Count: rowCount,
      });
    })
    .catch((err) => {
      next(err);
    });
};

const getAllChatsByProfile = (req, res, next) => {
  getOwnProfileId(req.user.id)
    .then((profileId) => getAllChatsByProfileQuery(profileId))
    .then(({ rows, rowCount }) => {
      res.status(200).json({
        message: 'these are all chats for your profile',
        status: 200,
        data: { chats: rows, count: rowCount },
      });
    })
    .catch((err) => {
      next(err);
    });
};

const getProfilesByLanguage = (req, res, next) => {
  const currentUserId = req.user && req.user.id;

  idSchema
    .validateAsync(req.params)
    .then(({ id }) => {
      return getProfilesByLanguageId(id, currentUserId);
    })
    .then(({ rows, rowCount }) => {
      if (!rowCount)
        throw new CustomError(
          'not found any profiles about this language',
          404,
        );

      res.status(200).json({
        message: 'this is the profiles about your learning language',
        status: 200,
        data: { profiles: rows },
      });
    })
    .catch((err) => {
      if (err.isJoi)
        return next(
          new CustomError(`Invalid Id ${err.details[0].message}`, 400),
        );
      next(err);
    });
};

const getMessagesByChat_id = (req, res, next) => {
  const chatIdFromQuery = req.query.chat_id;
  const chatIdFromParams = req.params && req.params.id;
  const chat_id = chatIdFromQuery || chatIdFromParams;

  idSchema
    .validateAsync({ id: chat_id })
    .then(({ id }) =>
      getOwnProfileId(req.user.id).then((profileId) => ({ id, profileId })),
    )
    .then(({ id, profileId }) => getMessages(id, profileId))
    .then(({ rows }) => {
      res.status(200).json({
        message: `these is all messages for this chat ${chat_id}`,
        status: 200,
        data: { chatId: chat_id, messages: rows },
      });
    })
    .catch((err) => {
      if (err.isJoi)
        return next(new CustomError(`${err.details[0].message}`, 400));

      next(err);
    });
};

// const addChat_Profile=({profile},res,next)=>{
//   const {chat_id, profile_id , receiver_id}=profile;
//   //////check receiver_id  .  handle errors
//   try{
//   addChat_ProfileQuery(chat_id,profile_id);
//   addChat_ProfileQuery(chat_id,receiver_id);
//   }catch(er){
//       next(er);
//   }
// }

// const addChatUser = (req, res, next) => {

//    const user = req.user;
//   const {name , receiver_id} = req.body;
//    addChat(name).then(({ rows, rowCount }) => {
//       const chat = rows[0];
//       if (!rowCount) {
//         throw new CustomError('the chat does not add it', 400);
//       }
//       res.status(201).json({
//         message: 'the chat is added successfully',
//         status: 201,
//         data: { chat: rows[0] },
//       });
//       getProfileByUserNameQuery(user.username).then(({rows})=>{
//           req.profile={chat_id: chat.id, profile_id:rows[0].id , receiver_id};
//             next();
//       })
//      })
//     .catch((err) => next(err));
// };

const addMessageUser = (req, res, next) => {
  getOwnProfileId(req.user.id)
    .then((senderId) =>
      messageSchema.validateAsync(req.body).then((message) => ({
        ...message,
        sender_id: senderId,
      })),
    )
    .then((message) => addMessage(message))
    .then(({ rows, rowCount }) => {
      if (!rowCount)
        throw new CustomError('the messages does not add it ', 404);
      res.status(201).json({
        message: 'the message is added successfully',
        status: 201,
        data: { messages: rows[0] },
      });
    })
    .catch((err) => {
      console.log({ err });
      if (err.isJoi) {
        return next(
          new CustomError(`Invalid Format :${err.details[0].message}`, 400),
        );
      }
      next(err);
    });
};

const deleteChatUser = (req, res, next) => {
  idSchema
    .validateAsync(req.params)
    .then(({ id: validId }) =>
      getOwnProfileId(req.user.id).then((profileId) =>
        deleteChatForProfileQuery(validId, profileId),
      ),
    )
    .then(({ rowCount, rows }) => {
      if (!rowCount) throw new CustomError('Chat not found', 404);
      res.status(201).json({
        message: 'Chat deleted successfully',
        data: { chat: rows[0] },
      });
    })
    .catch((err) => {
      if (err.isJoi) {
        return next(
          new CustomError(`Invalid id format: ${err.details[0].message}`, 400),
        );
      }
      next(err);
    });
};

const addChatUser = (req, res, next) => {
  const { name, username } = req.body || {};
  const user = req.user;

  const respondWithChat = (sender_id, receiver_id) => {
    if (receiver_id && receiver_id === sender_id) {
      throw new CustomError('you cant add chat to your self', 400);
    }

    const chatName = name || 'Chat';
    return addChat_ProfileQuery({
      name: chatName,
      profile_id: sender_id,
      receiver_id,
    }).then((result) => {
      const createdChat =
        result.rows && result.rows[0] && result.rows[0].chat_id
          ? { id: result.rows[0].chat_id, name: chatName }
          : result.chat || {
              id: result.rows[0]?.id || result.rows[0]?.chat_id,
              name: chatName,
            };

      res.status(201).json({
        message: 'the chat is added successfully',
        data: { chat: createdChat },
      });
    });
  };

  getProfileByUserId(user.id)
    .then(({ rows }) => {
      if (!rows[0]) throw new CustomError('User Profile Not found', 404);
      const sender_id = rows[0].id;

      if (!username) {
        return respondWithChat(sender_id, null);
      }

      return getProfileByUserNameQuery(username).then(
        ({ rows: profileRows }) => {
          if (!profileRows[0]) throw new CustomError('Profile not found', 404);
          if (
            profileRows[0].id === sender_id ||
            profileRows[0].user_id === user.id
          ) {
            throw new CustomError('you cant add chat to your self', 400);
          }
          return respondWithChat(sender_id, profileRows[0].id);
        },
      );
    })
    .catch((err) => {
      next(err);
    });
};

const editChatName = (req, res, next) => {
  const { name } = req.body;
  idSchema
    .validateAsync(req.params)
    .then(({ id }) => {
      if (typeof name !== 'string' || !name.trim()) {
        throw new CustomError('Chat name is required', 400);
      }
      return getOwnProfileId(req.user.id).then((profileId) =>
        editChatNameQuery(id, name.trim(), profileId),
      );
    })
    .then(({ rows }) => {
      if (!rows.length) throw new CustomError('Chat not found', 404);
      res.status(200).json({
        message: 'updated chat name successfully',
        status: 200,
        data: rows,
      });
    })
    .catch((err) => {
      if (err.isJoi) return next(new CustomError('Invalid chat id', 400));
      next(err);
    });
};

const deleteMessageFor = (req, res, next) => {
  const { message_id } = req.body;
  idSchema
    .validateAsync({ id: message_id })
    .then(({ id }) =>
      getOwnProfileId(req.user.id).then((profileId) =>
        deleteMessageForQuery(profileId, id),
      ),
    )
    .then(({ rows }) => {
      if (!rows.length)
        throw new CustomError(
          'Message not found or not available to this profile',
          404,
        );
      res
        .status(200)
        .json({ message: 'Message hidden for this profile', data: rows });
    })
    .catch((err) => {
      if (err.isJoi) return next(new CustomError('Invalid message id', 400));
      next(err);
    });
};

const checkIsDeletedChat = (req, res, next) => {
  const { chat_id } = req.query;
  if (!chat_id) {
    return res
      .status(400)
      .json({ message: 'Invalid Data For this  chat_id , profile_id' });
  }
  idSchema
    .validateAsync({ id: chat_id })
    .then(({ id }) =>
      getOwnProfileId(req.user.id).then((profileId) =>
        checkIsDeletedChatQuery(id, profileId),
      ),
    )
    .then(({ rows }) => {
      res
        .status(200)
        .json({ message: 'this check for chat_profile', data: rows });
    })
    .catch((err) => {
      if (err.isJoi) return next(new CustomError('Invalid chat id', 400));
      next(err);
    });
};

const restoreDeletedChat = (req, res, next) => {
  const { chat_id } = req.query;
  if (!chat_id) {
    return res
      .status(400)
      .json({ message: 'Invalid Data For this  chat_id , profile_id' });
  }
  idSchema
    .validateAsync({ id: chat_id })
    .then(({ id }) =>
      getOwnProfileId(req.user.id).then((profileId) =>
        restoreDeletedStatus(id, profileId),
      ),
    )
    .then(({ rows }) => {
      if (!rows.length) throw new CustomError('Chat not found', 404);
      res
        .status(200)
        .json({ message: 'restore deleted status successfully', data: rows });
    })
    .catch((err) => {
      if (err.isJoi) return next(new CustomError('Invalid chat id', 400));
      next(err);
    });
};

const deleteMessage = (req, res, next) => {
  idSchema
    .validateAsync(req.params)
    .then(({ id }) =>
      getOwnProfileId(req.user.id).then((profileId) =>
        deleteMessageQuery(id, profileId),
      ),
    )
    .then(({ rows }) => {
      if (!rows.length)
        throw new CustomError('Message not found or not yours', 404);
      req.app
        .get('io')
        ?.to(String(rows[0].chat_id))
        .emit('removedMessage', { messageId: rows[0].id });
      res.status(201).json({
        message: 'delete message is successfully',
        data: rows,
        status: 201,
      });
    })
    .catch((err) => {
      if (err.isJoi) return next(new CustomError('Invalid message id', 400));
      next(err);
    });
};

const deleteChatForProfile = (req, res, next) => {
  const { chat_id } = req.body;
  idSchema
    .validateAsync({ id: chat_id })
    .then(({ id }) =>
      getOwnProfileId(req.user.id).then((profileId) =>
        deleteChatForProfileQuery(id, profileId),
      ),
    )
    .then(({ rows }) => {
      if (!rows.length) throw new CustomError('Chat not found', 404);
      res
        .status(200)
        .json({ message: 'Chat deleted for this profile', data: rows });
    })
    .catch((err) => {
      if (err.isJoi) return next(new CustomError('Invalid chat id', 400));
      next(err);
    });
};

module.exports = {
  addChatUser,
  deleteChatUser,
  addMessageUser,
  getProfilesByLanguage,
  getMessagesByChat_id,
  getAllChats,
  getAllChatsByProfile,
  getProfileByUserName,
  deleteMessage,
  editChatName,
  deleteChatForProfile,
  checkIsDeletedChat,
  restoreDeletedChat,
  deleteMessageFor,
};
