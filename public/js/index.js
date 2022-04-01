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
