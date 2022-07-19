const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages')

const app = express();
const server = http.createServer(app);
const io = socketio(server);
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
const botName = 'myChatRoom bot'

// run when client connects
io.on('connection', socket => {
    socket.emit('message', formatMessage(botName,'welcome to myChatRoom!!!'));

    // broadcast when a user connects
    // sending message to the  public but new user
    socket.broadcast.emit('message', formatMessage(botName,'a user has joined the chat'));

    // broadcast when a user disconnects
   socket.on('disconnect', ()=> {
       // sending message to the public
       io.emit('message', formatMessage(botName,' a user has left the chat'))
    });

   // listen for chatMessage
    socket.on('chatMessage', (msg)=>{
        // sending message to the public
        io.emit('message', formatMessage('USER',msg));
    })
})
const PORT = 3000|| process.env.PORT;

server.listen(PORT, ()=> console.log(`server running on port ${PORT}`));