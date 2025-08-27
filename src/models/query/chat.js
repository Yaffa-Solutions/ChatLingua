const connection = require('../../database/connection');
const { CustomError } = require('../../middleware/error');

const getAllChatsQuery = () => {
  return connection.query(`SELECT  * FROM chats`);
};

const getProfileByUserNameQuery = (username) => {
  return connection.query(
    `SELECT p.id, p.image, p.learning_language_id , p.native_language_id
    FROM profiles p
    INNER JOIN users u ON p.user_id = u.id
    WHERE u.username = $1`,
    [username]
  );
};

const getAllChatsByProfileQuery = (profile_id) => {
  return connection.query(
    `SELECT name , cp.profile_id   
    FROM chats c 
    inner join chat_profiles cp 
    on c.id=cp.chat_id
    where profile_id=$1`,
    [profile_id]
  );
};

const getProfilesByLanguageId = (learning_language_id) => {
  return connection.query(
    `SELECT u.username  ,p.image , p.learning_language_id
     FROM profiles p inner join users u 
     on p.user_id =u.id WHERE native_language_id=$1`,
    [learning_language_id]
  );
};

const getMessages = (chat_id , profile_id) => {
  return checkIfExistsChatId({ chat_id }).then(({ rows }) => {
    if (!rows[0].chat_exist) {
      throw new CustomError(`Chat with id=${chat_id} not found`, 404);
    }
    return connection.query(
      `select 
     c.name as chat_name ,
     m.id, 
     m.content ,
     m.created_at,
     sender.id as sender_id ,
     receiver.id as receiver_id ,
     su.username as sender_username , 
     sender.image as sender_image,
     ru.username as receiver_username,
     cp.deleted_at 
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
     inner join chat_profiles cp 
     on cp.chat_id=c.id
     where m.chat_id=$1 and cp.profile_id=$2 and
    (cp.deleted_at is null or  m.created_at >= cp.deleted_at)
     order by m.created_at asc 
     `,
      [chat_id,profile_id]
    );
  });
};

const checkIsDeletedChatQuery = (chat_id, profile_id) => {
  return connection.query(
    `SELECT deleted_by from chat_profiles where chat_id=$1 and profile_id=$2`,
    [chat_id, profile_id]
  );
};

const addChat_ProfileQuery = ({ name, profile_id, receiver_id }) => {
  return connection
    .query(
      `SELECT chat_id FROM chat_profiles 
    where profile_id in ($1,$2) group by chat_id having count(distinct profile_id)=2`,
      [profile_id, receiver_id]
    )
    .then(({ rows, rowCount }) => {
      if (receiver_id == profile_id) {
        throw new CustomError('you cant add chat to your self', 400);
      }
      if (!rowCount && receiver_id != profile_id) {
        return connection.query(
          `INSERT INTO chats(name) VALUES($1) RETURNING* `,
          [name || 'My Chat']
        );
      } else {
        return { rows, existing: true };
      }
    })
    .then((result) => {
      if (result.existing) {
        return result;
      }

      return connection.query(
        `INSERT INTO chat_profiles(chat_id,profile_id)
     VALUES($1,$2),($1,$3) RETURNING*`,
        [result.rows[0].id, profile_id, receiver_id]
      );
      //  .then(({ rows }) => ({ chat_id: result.rows[0].chat_id }));
    });
};
// const addChat_ProfileQuery=(chat_id,profile_id)=>{
//   return connection.query(`INSERT INTO chat_profiles(chat_id,profile_id) VALUES($1,$2) RETURNING* `,[chat_id,profile_id])
// }

const checkIfExistsChatId = ({ chat_id, sender_id, receiver_id }) => {
  return connection.query(
    `SELECT EXISTS(SELECT 1 FROM chats where id=$1) as chat_exist ,  exists(SELECT 1 from profiles where id=$2) as sender_exist , exists(SELECT 1 from profiles where  id=$3) as receiver_exist`,
    [chat_id, sender_id, receiver_id]
  );
};

const addMessage = ({ chat_id, content, sender_id, receiver_id }) => {
  return checkIfExistsChatId({ chat_id, sender_id, receiver_id }).then(
    (result) => {
      const { chat_exist, sender_exist, receiver_exist } = result.rows[0];
      if (!chat_exist) {
        throw new CustomError(`Chat with id=${chat_id} not found`, 404);
      }
      if (!sender_exist) {
        throw new CustomError(
          `Sender profile with id=${sender_id} not found`,
          404
        );
      }
      if (!receiver_exist) {
        throw new CustomError(
          `Receiver profile with id=${receiver_id} not found`,
          404
        );
      }
      return connection.query(
        `INSERT INTO messages(chat_id, content, sender_id, receiver_id) 
     VALUES($1,$2,$3,$4)RETURNING*`,
        [chat_id, content, sender_id, receiver_id]
      );
    }
  );
};

const editChatNameQuery = (id, name) => {
  return connection.query(`update chats set name=$1 where id=$2 RETURNING*`, [
    name,
    id,
  ]);
};

const deleteChatForProfileQuery = (chat_id, profile_id) => {
  return connection.query(
    `update chat_profiles set deleted_by=true , deleted_at=Now() where chat_id=$1 and profile_id=$2`,
    [chat_id, profile_id]
  );
};

const deleteChat = (id) => {
  return connection.query(`DELETE FROM chats WHERE id=$1 RETURNING*`, [id]);
};

const deleteMessageQuery = (id) => {
  return connection.query(`DELETE FROM messages WHERE id=$1 RETURNING*`, [id]);
};

const restoreDeletedStatus = (chat_id, profile_id) => {
  return connection.query(
    `update chat_profiles set deleted_by=false where chat_id=$1 and profile_id=$2`,
    [chat_id, profile_id]
  );
};

module.exports = {
  addMessage,
  deleteChat,
  getProfilesByLanguageId,
  getMessages,
  getAllChatsQuery,
  getAllChatsByProfileQuery,
  getProfileByUserNameQuery,
  addChat_ProfileQuery,
  deleteMessageQuery,
  editChatNameQuery,
  deleteChatForProfileQuery,
  checkIsDeletedChatQuery,
  restoreDeletedStatus,
};
