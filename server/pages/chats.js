import Database from '../db.js';

export default async function chats() {
  const db = new Database();
  const chats = await db.get('chat');

  return `
<div>
  <button>click</button>
  <ul id="chat">
    ${chats.length ? chats.map((chat) => ListItem(chat.id)).join('\n') : ''}
  </ul>
</div>
`;
}

function ListItem(text) {
  return `<li class="chat-item">${text}</li>`;
}
