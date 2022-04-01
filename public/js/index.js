/* eslint-env browser */
import {io} from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js';
const socket = io(location.host);

socket.on('connect', () => {
  console.log('connected', socket.id);
});
socket.on('disconnect', () => {
  console.log('diconnected', socket.id);
});

const container = document.getElementById('container');
const chat = document.getElementById('chat');
const createButton = document.getElementById('create-chat');

createButton.addEventListener('click', () => {
  socket.emit('create-chat', socket.id, (chatId) => {
    console.log(chatId);
    setChat(chatId);
  });
  createButton.hidden = true;
});

function setChat(id) {
  container.innerHTML = `<div>chat: ${id}</div>`;
}

chat.addEventListener('click', (e) => {
  const chatId = e.target.dataset.id;
  socket.emit('join-chat', {id: socket.id, chatId}, (approved) => {
    if (approved) {
      joinChat(chatId);
    }
  });
});

function joinChat(id) {
  container.innerHTML = `
<div>
  chat: ${id}
  <div id="messages"></div>
  <div>
    <form id="send">
        <input type="text" name="msg" id="msg"/>
    </form>
  </div>
</div>
`;
  document.getElementById('send').addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('msg').value;
    console.log(msg);
  });
}
