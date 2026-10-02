const connection = require('../connection');

async function cleanupInvalidSelfChats() {
  const invalidChatIds = await connection.query(`
    SELECT chat_id
    FROM chat_profiles
    GROUP BY chat_id
    HAVING COUNT(DISTINCT profile_id) = 1 AND COUNT(*) > 1
  `);

  if (!invalidChatIds.rowCount) {
    console.log('No invalid self-chat rows found.');
    return 0;
  }

  const invalidIds = invalidChatIds.rows.map((row) => row.chat_id);

  const deletedMessages = await connection.query(
    `DELETE FROM messages
     WHERE chat_id = ANY($1::int[])
     RETURNING chat_id`,
    [invalidIds],
  );

  const deletedProfiles = await connection.query(
    `DELETE FROM chat_profiles
     WHERE chat_id = ANY($1::int[])
     RETURNING chat_id`,
    [invalidIds],
  );

  const deletedChats = await connection.query(
    `DELETE FROM chats
     WHERE id = ANY($1::int[])
     RETURNING id`,
    [invalidIds],
  );

  console.log(
    `Removed ${deletedMessages.rowCount} invalid message rows, ` +
      `${deletedProfiles.rowCount} invalid chat memberships, and ` +
      `${deletedChats.rowCount} invalid self-chats.`,
  );

  return deletedChats.rowCount;
}

cleanupInvalidSelfChats()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed to cleanup invalid self-chats:', error);
    process.exit(1);
  });
