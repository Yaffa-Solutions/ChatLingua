const app = require("./app");
const port = app.get("port");
const http=require('http');
const {Server} = require('socket.io');


const server = http.createServer(app);

const io = new Server(server,{cors:{
    origin:"http://localhost:5000"
}});

io.on('connection',(socket)=>{
    console.log('User Connected',socket.id);

    socket.on('UserJoin',(username,chat_id)=>{
       socket.join(chat_id);
       io.to(chat_id).emit('UserJoined',{
        username
       });
    })
    
    socket.on('sendMessage',({chat_id,content,sender_id,receiver_id})=>{
      io.to(chat_id).emit('receiveMessage',{chat_id,content,sender_id,receiver_id});
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