const { idSchema, messageSchema } = require('../../common/validations/chat');
const { CustomError } = require('../middleware/error');
const {
  deleteChat,
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

const getAllChats = (req, res, next) => {
  getAllChatsQuery()
    .then(({ rows, rowCount }) => {
      res
        .status(200)
        .json({
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
      res
        .status(200)
        .json({
          message: `this is data profile for this username ${username}`,
          data: { profile: rows },
          Count: rowCount,
        });
    })
    .catch((err) => {
      next(err);
    });
};

const getAllChatsByProfile = ({ params }, res, next) => {
  idSchema
    .validateAsync({ id: params.profile_id })
    .then(({ id }) => {
      return getAllChatsByProfileQuery(id);
    })
    .then(({ rows, rowCount }) => {
      res
        .status(200)
        .json({
          message: `these is all chats for this profile ${params.profile_id}`,
          status: 200,
          data: { chats: rows, count: rowCount },
        });
    })
    .catch((err) => {
      next(err);
    });
};

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

const getMessagesByChat_id = (req, res, next) => {
  const {chat_id,profile_id} = req.query;
  console.log({chat_id,profile_id})
  idSchema
    .validateAsync({ id: chat_id })
    .then(({ id }) => {
      return getMessages(id,profile_id);
    })
    .then(({ rows }) => {
      res.status(200).json({
        message: `these is all messages for this chat ${chat_id}`,
        status: 200,
        data: { chatId: chat_id, messages: rows },
      });
    })
    .catch((err) => {
      console.log(err);
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

const addChatUser = (req, res, next) => {
  const { name, username } = req.body;
  const user=req.user;
  let receiver_id;
  getProfileByUserNameQuery(username)
    .then(({ rows }) => {
      receiver_id = rows[0].id;
      console.log(1);
      return getProfileByUserId(user.id);
    })
    .then(({ rows }) => {
      const sender_id = rows[0].id;  
      console.log(2);    
      return addChat_ProfileQuery({ name, profile_id:sender_id, receiver_id });
    })
    .then((result) => {
      console.log(result.rows);
      res
        .status(201)
        .json({ message: 'chat is added successfully', data: result.rows });
    })
    .catch((err) => {
      next(err);
    });
};


const editChatName=({body:{name},params:{id}},res,next)=>{
  editChatNameQuery(id,name)
  .then(({rows})=>{
    res.status(201).json({message:'updated chat name successfully' , status:201 , data:rows});
  }).catch((err)=>next(err));
}

const deleteMessageFor=(req,res,next)=>{
  const {message_id,profile_id}=req.body;
  deleteMessageForQuery(profile_id,message_id)
  .then(({rows})=>{
    res.status(200).json({message:`Message deleted for this profile :${req.user.id}`,data:rows})
  }).catch(err=>next(err))
}


const checkIsDeletedChat=(req,res,next)=>{
  const {chat_id,profile_id}=req.query;
  if(!chat_id || !profile_id){
    res.status(400).json({message:'Invalid Data For this  chat_id , profile_id'});
  }
  checkIsDeletedChatQuery(chat_id,profile_id).then(({rows})=>{
    res.status(200).json({message:'this check for chat_profile',data:rows});
  }).catch((err)=> next(err));
}


const restoreDeletedChat=(req,res,next)=>{
  const {chat_id,profile_id}=req.query;
  if(!chat_id || !profile_id){
    res.status(400).json({message:'Invalid Data For this  chat_id , profile_id'});
  }
  restoreDeletedStatus(chat_id,profile_id).then(({rows})=>{
    res.status(200).json({message:'restore deleted status successfully',data:rows});
  }).catch((err)=> next(err));
}


const deleteMessage=({params:{id}},res,next)=>{
  deleteMessageQuery(id).then(({rows})=>{
    res.status(201).json({message:'delete message is successfully',data:rows,status:201});
  }).catch((err)=>{
    next(err);
  });
}


const deleteChatForProfile=({body:{chat_id , profile_id}},res , next)=>{
  deleteChatForProfileQuery(chat_id , profile_id).then(({rows})=>{
    res.status(200).json({message:`deleted chat for this profile ${profile_id}`,data:rows});
  }).catch((err)=>next(err));
}



module.exports = {
  addChatUser,
  deleteChatUser,
  addMessageUser,
  getProfilesByLanguage,
  getMessagesByChat_id,
  getAllChats,
  getAllChatsByProfile,
  getProfileByUserName,
  deleteMessage , 
  editChatName , 
  deleteChatForProfile  , 
  checkIsDeletedChat , 
  restoreDeletedChat,
  deleteMessageFor
};
