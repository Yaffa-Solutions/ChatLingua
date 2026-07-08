const app = require("./app");
const port = app.get("port");
const http=require('http');
const {Server} = require('socket.io');


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || true,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on('connection',(socket)=>{
    console.log('User Connected',socket.id);

    socket.on('UserJoin',(username,chat_id)=>{
       socket.join(chat_id);
       io.to(chat_id).emit('UserJoined',{
        username
       });
    })
    
    socket.on('sendMessage',({messageId,chat_id,content,sender_id,receiver_id,sender_image })=>{
      io.to(chat_id).emit('receiveMessage',{messageId,chat_id,content,sender_id,receiver_id,sender_image});
    })

    socket.on('removeMessage',({messageId,chat_id})=>{
      io.to(chat_id).emit('removedMessage',{messageId})
    })

    socket.on('deleteChat',({chat_id})=>{
      io.to(chat_id).emit('chatDeleted',{chat_id})
    })

    socket.on('changeChatName',({chat_id,chat_name})=>{
      io.to(chat_id).emit('chatNameChanged',{chat_id,chat_name})
    })
    
    socket.on('typing',(username,chat_id)=>{
      socket.to(chat_id).emit('userTyping',{
        username
      })
    })
  
});
server.listen(port, () => {
  console.log(`App is live on http://localhost:${port}`);
});