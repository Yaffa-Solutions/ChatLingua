const connection = require('../../database/connection');
const { CustomError } = require('../../middleware/error');

const getAllChatsQuery = (profile_id) => {
  return connection.query(
    `SELECT DISTINCT c.*
     FROM chats c
     INNER JOIN chat_profiles cp ON cp.chat_id = c.id
     LEFT JOIN chat_profiles other_cp
       ON other_cp.chat_id = c.id AND other_cp.profile_id <> $1
     WHERE cp.profile_id = $1
       AND other_cp.profile_id IS NOT NULL`,
    [profile_id],
  );
};

const getProfileByUserNameQuery = (username) => {
  return connection.query(
    `SELECT p.id, p.user_id, p.image, p.learning_language_id , p.native_language_id
    FROM profiles p
    INNER JOIN users u ON p.user_id = u.id
    WHERE u.username = $1`,
    [username],
  );
};

const getAllChatsByProfileQuery = (profile_id) => {
  return connection.query(
    `SELECT c.id AS chat_id, c.name,
            other_profile.id AS other_profile_id,
            other_user.username AS other_username,
            other_profile.image AS other_image
     FROM chats c
     INNER JOIN chat_profiles cp ON cp.chat_id = c.id AND cp.profile_id = $1
     INNER JOIN chat_profiles other_cp
       ON other_cp.chat_id = c.id AND other_cp.profile_id <> $1
     INNER JOIN profiles other_profile ON other_profile.id = other_cp.profile_id
     INNER JOIN users other_user ON other_user.id = other_profile.user_id
     WHERE cp.profile_id = $1`,
    [profile_id],
  );
};

const getProfilesByLanguageId = (learning_language_id, current_user_id) => {
  return connection.query(
    `SELECT u.username, p.id, p.user_id, p.image, p.learning_language_id, p.native_language_id
     FROM profiles p
     INNER JOIN users u ON p.user_id = u.id
     WHERE p.native_language_id = $1
       AND p.user_id <> $2`,
    [learning_language_id, current_user_id],
  );
};

const getMessageTranslationContext = (message_id, user_id) => {
  return connection.query(
    `SELECT m.content,
          sender.id AS sender_id,
          sender_language.name AS sender_native_language,
          receiver.id AS receiver_id,
          receiver_language.name AS receiver_native_language
     FROM messages m
     INNER JOIN profiles sender ON sender.id = m.sender_id
     INNER JOIN profiles receiver ON receiver.id = m.receiver_id
     INNER JOIN languages sender_language
       ON sender_language.id = sender.native_language_id
     INNER JOIN languages receiver_language
       ON receiver_language.id = receiver.native_language_id
     WHERE m.id = $1
       AND (sender.user_id = $2 OR receiver.user_id = $2)`,
    [message_id, user_id],
  );
};

const deleteMessageForQuery = (profile_id, message_id) => {
  return connection.query(
    `Update messages
     SET deleted_for = array_append(COALESCE(deleted_for, '{}')::integer[], $1::integer)
     where id=$2
       and NOT ($1::integer = ANY(COALESCE(deleted_for, '{}'::integer[])))
       and exists (
         select 1 from chat_profiles cp
         where cp.chat_id=messages.chat_id and cp.profile_id=$1
       )
     RETURNING*`,
    [profile_id, message_id],
  );
};

// const deleteMessageForQuery=(message_id)=>{
//   //need checks
//   return connection.query(`Update messages
//   set deleted_for=1
//   where id=$1 RETURNING*`,[message_id])
// }

const getMessages = (chat_id, profile_id) => {
  return checkIfExistsChatId({ chat_id, sender_id: profile_id }).then(
    ({ rows }) => {
      const { chat_exist, sender_member } = rows[0];
      if (!chat_exist) {
        throw new CustomError(`Chat with id=${chat_id} not found`, 404);
      }
      if (!sender_member) {
        throw new CustomError('You are not a participant in this chat', 403);
      }
      return connection.query(
        `WITH restored_membership AS (
           UPDATE chat_profiles
           SET deleted_by = false, deleted_at = NULL
           WHERE chat_id = $1 AND profile_id = $2
           RETURNING chat_id
         )
         select
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
     inner join restored_membership rm
     on rm.chat_id=c.id
     where m.chat_id=$1 and cp.profile_id=$2 and NOT ($2 = ANY(COALESCE(m.deleted_for,'{}'::integer[])))
     order by m.created_at asc 
     `,
        [chat_id, profile_id],
      );
    },
  );
};

const checkIsDeletedChatQuery = (chat_id, profile_id) => {
  return connection.query(
    `SELECT deleted_by from chat_profiles where chat_id=$1 and profile_id=$2`,
    [chat_id, profile_id],
  );
};

const addChat_ProfileQuery = ({ name, profile_id, receiver_id }) => {
  if (receiver_id && receiver_id === profile_id) {
    throw new CustomError('you cant add chat to your self', 400);
  }

  if (!receiver_id) {
    return connection
      .query(`INSERT INTO chats(name) VALUES($1) RETURNING*`, [name || 'Chat'])
      .then(({ rows }) => ({
        rows,
        chat: rows[0],
        single: true,
      }))
      .then(({ rows, chat }) =>
        connection
          .query(
            `INSERT INTO chat_profiles(chat_id,profile_id)
       VALUES($1,$2) RETURNING*`,
            [chat.id, profile_id],
          )
          .then(() => ({ rows: [chat], chat, single: true })),
      );
  }

  return connection
    .query(
      `SELECT cp.chat_id, c.name
       FROM chat_profiles cp
       INNER JOIN chats c ON c.id = cp.chat_id
       WHERE cp.profile_id IN ($1, $2)
       GROUP BY cp.chat_id, c.name
       HAVING COUNT(DISTINCT cp.profile_id) = 2`,
      [profile_id, receiver_id],
    )
    .then(({ rows, rowCount }) => {
      if (rowCount > 0) {
        return { rows, existing: true };
      }

      return connection.query(
        `INSERT INTO chats(name) VALUES($1) RETURNING* `,
        [name || 'Chat'],
      );
    })
    .then((result) => {
      if (result.existing) {
        return result;
      }

      return connection.query(
        `INSERT INTO chat_profiles(chat_id,profile_id)
     VALUES($1,$2),($1,$3) RETURNING*`,
        [result.rows[0].id, profile_id, receiver_id],
      );
    });
};
// const addChat_ProfileQuery=(chat_id,profile_id)=>{
//   return connection.query(`INSERT INTO chat_profiles(chat_id,profile_id) VALUES($1,$2) RETURNING* `,[chat_id,profile_id])
// }

const checkIfExistsChatId = ({ chat_id, sender_id, receiver_id }) => {
  return connection.query(
    `SELECT EXISTS(SELECT 1 FROM chats where id=$1) as chat_exist,
       EXISTS(SELECT 1 FROM profiles where id=$2) as sender_exist,
       EXISTS(SELECT 1 FROM profiles where id=$3) as receiver_exist,
       EXISTS(SELECT 1 FROM chat_profiles where chat_id=$1 and profile_id=$2) as sender_member,
       EXISTS(SELECT 1 FROM chat_profiles where chat_id=$1 and profile_id=$3) as receiver_member`,
    [chat_id, sender_id, receiver_id],
  );
};

const addMessage = ({ chat_id, content, sender_id, receiver_id }) => {
  return checkIfExistsChatId({ chat_id, sender_id, receiver_id }).then(
    (result) => {
      const {
        chat_exist,
        sender_exist,
        receiver_exist,
        sender_member,
        receiver_member,
      } = result.rows[0];
      if (!chat_exist) {
        throw new CustomError(`Chat with id=${chat_id} not found`, 404);
      }
      if (!sender_exist) {
        throw new CustomError(
          `Sender profile with id=${sender_id} not found`,
          404,
        );
      }
      if (!receiver_exist) {
        throw new CustomError(
          `Receiver profile with id=${receiver_id} not found`,
          404,
        );
      }
      if (!sender_member || !receiver_member) {
        throw new CustomError(
          'Both profiles must be participants in this chat',
          403,
        );
      }
      return connection.query(
        `INSERT INTO messages(chat_id, content, sender_id, receiver_id) 
     VALUES($1,$2,$3,$4)RETURNING*`,
        [chat_id, content, sender_id, receiver_id],
      );
    },
  );
};

const editChatNameQuery = (id, name, profile_id) => {
  return connection.query(
    `UPDATE chats SET name=$1
     WHERE id=$2 AND EXISTS (
       SELECT 1 FROM chat_profiles WHERE chat_id=$2 AND profile_id=$3
     )
     RETURNING*`,
    [name, id, profile_id],
  );
};

const deleteChatForProfileQuery = (chat_id, profile_id) => {
  return connection.query(
    `update chat_profiles set deleted_by=true , deleted_at=Now()
     where chat_id=$1 and profile_id=$2 RETURNING chat_id`,
    [chat_id, profile_id],
  );
};

const deleteChat = (id) => {
  return connection.query(`DELETE FROM chats WHERE id=$1 RETURNING*`, [id]);
};

const deleteMessageQuery = (id, profile_id) => {
  return connection.query(
    `DELETE FROM messages WHERE id=$1 AND sender_id=$2 RETURNING*`,
    [id, profile_id],
  );
};

const restoreDeletedStatus = (chat_id, profile_id) => {
  return connection.query(
    `update chat_profiles set deleted_by=false, deleted_at=NULL
     where chat_id=$1 and profile_id=$2 RETURNING chat_id`,
    [chat_id, profile_id],
  );
};

module.exports = {
  addMessage,
  deleteChat,
  getProfilesByLanguageId,
  getMessageTranslationContext,
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
  deleteMessageForQuery,
};
