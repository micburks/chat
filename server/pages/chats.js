import Database from '../db.js';

export default async function chats() {
  const db = new Database();
  const chats = await db.getAll('chat');

  return `
    <div id="container">
      <button id="create-chat">create a new chat</button>
      <br>
    ${
      chats.length
        ? `existing chats:
      <ul id="chat">
        ${chats.map((chat) => ListItem(chat.id)).join('\n')}
      </ul>`
        : 'no chats available'
    }
    </div>
  `;
}

function ListItem(text) {
  return `<li class="chat-item" data-id="${text}">${text}</li>`;
}
