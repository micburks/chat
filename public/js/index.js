/* eslint-env browser */
import SimplePeer from 'simple-peer';
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
    createChat(chatId);
  });
  createButton.hidden = true;
});

function createChat(id) {
  peer = createPeer(true);
  container.innerHTML = Chat(id);

  document.getElementById('send').addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('msg').value;
    sendMessage(msg);
  });
}

chat.addEventListener('click', (e) => {
  const chatId = e.target.dataset.id;
  socket.emit('join-chat', {id: socket.id, chatId}, (approved) => {
    if (approved) {
      joinChat(chatId);
    }
  });
});

let peer = null;
function createPeer(initiator) {
  peer = new SimplePeer({initiator});
  peer.on('error', (err) => console.log('error', err));
  peer.on('signal', (data) => {
    console.log('SIGNAL', JSON.stringify(data));
  });
  peer.on('connect', () => {
    console.log('CONNECT');
    peer.send('whatever' + Math.random());
  });
  peer.on('data', (data) => {
    console.log('data: ' + data);
  });
  return peer;
}

function joinChat(id) {
  peer = createPeer(false);
  container.innerHTML = Chat(id);

  document.getElementById('send').addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('msg').value;
    sendMessage(msg);
  });
}

function sendMessage(msg) {
  if (!peer) {
    console.log('no peers connected');
    return;
  }
  peer.signal(msg);
}

function Chat(id) {
  return `
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
}

function ListElement(text) {
  return `
<li class="chat-list">${text}</li>
`;
}
