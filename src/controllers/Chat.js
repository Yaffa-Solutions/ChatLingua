const { idSchema, messageSchema } = require('../../common/validations/chat');
const { CustomError } = require('../middleware/error');
const {
  addChat,
  deleteChat,
  addMessage,
  getProfilesByLanguageId,
  getMessages,
  getAllChatsQuery,
  getAllChatsByProfileQuery,
  addChat_ProfileQuery,
  getProfileByUserNameQuery

} = require('../models/query/chat');



const getAllChats=(req,res, next)=>{
    getAllChatsQuery().then(({rows , rowCount}) => {
        res.status(200).json({message:'these is all chats',status:200,data:{chats:rows} ,count:rowCount});
    }).catch((err) => {
        next(err);
    });
}


const getProfileByUserName=({params:{username}},res,next)=>{
   getProfileByUserNameQuery(username).then(({rows,rowCount}) => {
    res.status(200).json({message:`this is data profile for this username ${username}`,data:{profile:rows},Count:rowCount})
  }).catch((err) => {
    next(err);
  });
}

const getAllChatsByProfile=({params},res,next)=>{
    idSchema.validateAsync({id:params.profile_id}).then(({id})=>{
       return getAllChatsByProfileQuery(id);
    }).then(({rows , rowCount})=>{
        res.status(200).json({message:`these is all chats for this profile ${params.profile_id}`,status:200 ,data:{chats:rows , count:rowCount }});
    }).catch((err)=>{
        next(err);
    })
}

const getProfilesByLanguage = ({ params }, res, next) => {
  idSchema
    .validateAsync(params)
    .then(({ id }) => {
      return getProfilesByLanguageId(id);
    })
    .then(({ rows, rowCount }) => {
      if (!rowCount)
        throw new CustomError(
          'not found any profiles about this language',
          404
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
          new CustomError(`Invalid Id ${err.details[0].message}`, 400)
        );
      next(err);
    });
};

const getMessagesByChat_id = ({ params }, res, next) => {
  const chatId = params.chat_id;
  idSchema
    .validateAsync({ id: chatId })
    .then(({ id }) => {
      return getMessages(id);
    })
    .then(({ rows }) => {
      res.status(200).json({
        message: `these is all messages for this chat ${chatId}`,
        status: 200,
        data: { chatId: chatId, messages: rows },
      });
    })
    .catch((err) => {
      console.log(err);
      if (err.isJoi)
        return next(new CustomError(`${err.details[0].message}`, 400));

      next(err);
    });
};

const addChat_Profile=({body:{chat_id,profile_id}},res,next)=>{
  addChat_ProfileQuery(chat_id,profile_id)
  .then(({rows,rowCount})=>{
    res.status(200).json({message:'add chat profile successfully',data:{chat_profiles:rows} ,Count:rowCount});
  }).catch(err=>next(err));
}

const addChatUser = ({ body: { name } }, res, next) => {
  addChat(name)
    .then(({ rows, rowCount }) => {
      if (!rowCount) {
        throw new CustomError('the chat does not add it', 400);
      }
      res.status(201).json({
        message: 'the chat is added successfully',
        status: 201,
        data: { chat: rows[0] },
      });
    })
    .catch((err) => next(err));
};


const addMessageUser = ({ body }, res, next) => {
  messageSchema
    .validateAsync(body)
    .then((result) => {
      return addMessage(result);
    })
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
          new CustomError(`Invalid Format :${err.details[0].message}`, 400)
        );
      }
      next(err);
    });
};

const deleteChatUser = (req, res, next) => {
  idSchema
    .validateAsync(req.params)
    .then(({ id: validId }) => {
      return deleteChat(validId);
    })
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
          new CustomError(`Invalid id format: ${err.details[0].message}`, 400)
        );
      }
      next(err);
    });
};

module.exports = {
  addChatUser,
  deleteChatUser,
  addMessageUser,
  getProfilesByLanguage,
  getMessagesByChat_id,
  getAllChats , 
  getAllChatsByProfile ,
  getProfileByUserName , 
  addChat_Profile
};
