/* eslint-env browser */
import {Chat} from './chat.js';

const containerEl = document.getElementById('container');
const chatEl = document.getElementById('chat');
const createButtonEl = document.getElementById('create-chat');
let messagesEl = null;

const chat = new Chat(receiveMessage);

createButtonEl.addEventListener('click', () => {
  chat.create((chatId) => {
    containerEl.innerHTML = ChatComp(chatId);
    document.getElementById('send').addEventListener('submit', sendMessage);
    createButtonEl.hidden = true;
  });
});

if (chatEl) {
  chatEl.addEventListener('click', (e) => {
    const chatId = e.target.dataset.id;
    chat.join(chatId, () => {
      containerEl.innerHTML = ChatComp(chatId);
      document.getElementById('send').addEventListener('submit', sendMessage);
    });
  });
}

function sendMessage(e) {
  e.preventDefault();
  const msg = document.getElementById('msg');
  chat.sendMessage(msg.value);
  if (!messagesEl) {
    messagesEl = document.getElementById('messages');
  }
  messagesEl.innerHTML += ListElementComp(`sent: ${msg.value}`);
  msg.value = '';
}

function receiveMessage(msg) {
  if (!messagesEl) {
    messagesEl = document.getElementById('messages');
  }
  messagesEl.innerHTML += ListElementComp(`receieved: ${msg}`);
}

function ChatComp(id) {
  return `
    <div>
      chat: ${id}
      <div id="messages"></div>
      <form id="send">
          <input type="text" name="msg" id="msg"/>
      </form>
    </div>
  `;
}

function ListElementComp(text) {
  return `
    <li class="chat-list">${text}</li>
  `;
}
