const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages')
const {userJoin, getUser, getRoomUsers, getUserLeaves} = require('./utils/users')
const app = express();
const server = http.createServer(app);
const io = socketio(server);
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
const botName = 'myChatRoom bot'

// run when client connects
io.on('connection', socket => {
    // allow user join a room
    socket.on('joinRoom', ({username, room})=>{
        const user = userJoin(socket.id, username,room)
        // user should join room
        socket.join(user.room)

        // welcome current user
        socket.emit('message', formatMessage(botName,'welcome to myChatRoom!!!'));

        // broadcast when a user connects
        // sending message to the  public but new user
        socket.broadcast
            .to(user.room)
            .emit('message',
            formatMessage(botName,`${user.username} has joined the chat`));

        // send users room and room info
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })


   // listen for chatMessage
    socket.on('chatMessage', (msg)=>{
        const user = getUser(socket.id);
        // sending message to the public
        io.to(user.room).emit('message', formatMessage(user.username,msg));
    })

    // broadcast when a user disconnects
    socket.on('disconnect', ()=> {
        const user = getUserLeaves(socket.id);
        if(user) {
            // sending message to the public
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));

            // send users room and room info
            io.to(user.room).emit('roomUsers',{
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    });
})
const PORT = 3000|| process.env.PORT;

server.listen(PORT, ()=> console.log(`server running on port ${PORT}`));