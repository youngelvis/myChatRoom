// accessing the chart form element from chat.html
const chatForm = document.getElementById('chat-form');

// accessing the chat messages from chat.html
const chatMessges = document.querySelector('.chat-messages')
const socket = io();
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
    // getting message from chatbox
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