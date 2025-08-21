const connection = require('../../database/connection');
const { CustomError } = require('../../middleware/error');

const addChat = (name) => {
  return connection.query(`INSERT INTO chats(name) VALUES($1)RETURNING *`, [
    name,
  ]);
};

const deleteChat = (id) => {
  return connection.query(`DELETE FROM chats WHERE id=$1 RETURNING*`, [id]);
};

const checkIfExistsChatId = ({chat_id , sender_id, receiver_id}) => {
  return connection.query(`SELECT EXISTS(SELECT 1 FROM chats where id=$1) as chat_exist ,  exists(SELECT 1 from profiles where id=$2) as sender_exist , exists(SELECT 1 from profiles where  id=$3) as receiver_exist`, [
    chat_id, sender_id, receiver_id
  ]);
};

const addMessage = ({ chat_id, content, sender_id, receiver_id }) => {
  return checkIfExistsChatId({chat_id,sender_id,receiver_id}).then((result) => {

    const {chat_exist,sender_exist,receiver_exist}=result.rows[0];
     if (!chat_exist) {
      throw new CustomError(`Chat with id=${chat_id} not found`, 404);
    }
    if (!sender_exist) {
      throw new CustomError(`Sender profile with id=${sender_id} not found`, 404);
    }
    if (!receiver_exist) {
      throw new CustomError(`Receiver profile with id=${receiver_id} not found`, 404);
    } 
      return connection.query(
        `INSERT INTO messages(chat_id, content, sender_id, receiver_id) 
     VALUES($1,$2,$3,$4)RETURNING*`,
        [chat_id, content, sender_id, receiver_id]
      );
  });
};

const getProfilesByLanguageId = (learning_language_id) => {
  return connection.query(
    `SELECT u.username  ,p.image , p.learning_language_id
     FROM profiles p inner join users u 
     on p.user_id =u.id WHERE native_language_id=$1`,
    [learning_language_id]
  );
};

const getMessages = (chat_id) => {


 return checkIfExistsChatId({chat_id}).then(({rows})=>{
    if(!rows[0].chat_exist){
      throw new CustomError(`Chat with id=${chat_id} not found`, 404);
    }

      return connection.query(
    `select 
     c.name as chat_name , 
     m.content ,
     m.created_at,
     su.id as sender_id ,
     ru.id as receiver_id ,
     su.username as sender_username , 
     sender.image as sender_image,
     ru.username as receiver_username,
     receiver.image as receiver_image
     from messages m 
     inner join chats c
     on c.id = m.chat_id
     inner join profiles sender 
     on sender.id=m.sender_id 
     inner join users su 
     on su.id=sender.user_id
     inner join profiles receiver 
     on receiver.id=m.receiver_id
     inner join users ru 
     on ru.id=receiver.user_id 
     where m.chat_id=$1
     order by m.created_at asc 
     `,
    [chat_id]
  );
  })

};

module.exports = { addChat, addMessage, deleteChat, getProfilesByLanguageId, getMessages };
