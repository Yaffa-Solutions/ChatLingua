const app = require('./app');
const port = app.get('port');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { app: appConfig } = require('./config');
const connection = require('./src/database/connection');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || false,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
app.set('io', io);

io.use((socket, next) => {
  const tokenCookie = socket.handshake.headers.cookie
    ?.split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith('token='));
  if (!tokenCookie) return next(new Error('Unauthorized'));

  jwt.verify(
    decodeURIComponent(tokenCookie.slice('token='.length)),
    appConfig.jwtSecret,
    async (error, user) => {
      if (error) return next(new Error('Unauthorized'));
      try {
        const { rows } = await connection.query(
          'SELECT id FROM profiles WHERE user_id=$1',
          [user.id],
        );
        if (!rows[0]) return next(new Error('Profile required'));
        socket.data.user = user;
        socket.data.profileId = rows[0].id;
        next();
      } catch (dbError) {
        next(dbError);
      }
    },
  );
});

const isChatMember = async (chatId, profileId) => {
  const { rows } = await connection.query(
    'SELECT EXISTS(SELECT 1 FROM chat_profiles WHERE chat_id=$1 AND profile_id=$2) AS is_member',
    [chatId, profileId],
  );
  return rows[0].is_member;
};

io.on('connection', (socket) => {
  socket.on('UserJoin', async (_username, chatId) => {
    const numericChatId = Number(chatId);
    if (!Number.isSafeInteger(numericChatId) || numericChatId < 1) return;
    try {
      if (!(await isChatMember(numericChatId, socket.data.profileId))) return;
      const room = String(numericChatId);
      socket.join(room);
      io.to(room).emit('UserJoined', { username: socket.data.user.username });
    } catch (error) {
      console.error('Socket chat membership check failed', error.message);
    }
  });

  socket.on('sendMessage', async ({ messageId, chat_id } = {}) => {
    const numericMessageId = Number(messageId);
    const numericChatId = Number(chat_id);
    if (
      !Number.isSafeInteger(numericMessageId) ||
      numericMessageId < 1 ||
      !Number.isSafeInteger(numericChatId) ||
      numericChatId < 1
    )
      return;
    try {
      if (!socket.rooms.has(String(numericChatId))) return;
      const { rows } = await connection.query(
        `SELECT m.id AS "messageId", m.chat_id, m.content, m.sender_id,
                m.receiver_id, p.image AS sender_image
         FROM messages m
         INNER JOIN profiles p ON p.id=m.sender_id
         WHERE m.id=$1 AND m.chat_id=$2 AND m.sender_id=$3`,
        [numericMessageId, numericChatId, socket.data.profileId],
      );
      if (!rows[0]) return;
      io.to(String(numericChatId)).emit('receiveMessage', rows[0]);
    } catch (error) {
      console.error('Socket message lookup failed', error.message);
    }
  });

  socket.on('typing', async (_username, chatId) => {
    const numericChatId = Number(chatId);
    if (!Number.isSafeInteger(numericChatId) || numericChatId < 1) return;
    const room = String(numericChatId);
    if (!socket.rooms.has(room)) return;
    try {
      if (!(await isChatMember(numericChatId, socket.data.profileId))) return;
      socket
        .to(room)
        .emit('userTyping', { username: socket.data.user.username });
    } catch (error) {
      console.error('Socket typing membership check failed', error.message);
    }
  });
});
server.listen(port, () => {
  console.log(`App is live on http://localhost:${port}`);
});
