// accessing the chart form element from chat.html
const chatForm = document.getElementById('chat-form');

const roomName = document.getElementById('room-name');
const userList = document.getElementById('users')

//get username and room from url

const{ username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
// accessing the chat messages from chat.html
const chatMessges = document.querySelector('.chat-messages')
const socket = io();
//join chatroom sending message to server
socket.emit('joinRoom', {username, room})
//get room and users

socket.on('roomUsers', ({room, users})=>{
    outputRoomName(room);
    outputUsers(users);
})
// message from server
socket.on('message', message=>{
    console.log(message)
    outputMessage(message)
    //scroll down automatically to show current message

    chatMessges.scrollTop = chatMessges.scrollHeight;
});

// message submit

chatForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    // getting message from chat box
    const msg = e.target.elements.msg.value;

    // sending message to server
    socket.emit('chatMessage', msg);
    // clear out the input
    e.target.elements.msg.value ='';
    e.target.elements.msg.focus();
});

// output message to DOM

 outputMessage = (message)=>{
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML =` <p class="meta">${message.username} <span>${message.time}</span></p>
                <p class="text">
                    ${message.text}
                </p>`;
    document.querySelector('.chat-messages').appendChild(div)
}

//add room name to DOM

outputRoomName = (room)=>{
     roomName.innerText = room;
}

// add users to DOM

outputUsers = (users)=>{
    userList.innerHTML = `
        ${users.map(user=>`<li>${user.username}</li>`).join('')}
    `;
}
