/* eslint-env browser */

const chat = document.getElementById('chat');
const button = document.getElementsByTagName('button')[0];
button.addEventListener('click', () => {
  const rand = Math.random().toFixed(7).substring(2).toString();
  chat.innerHTML = (chat.innerHTML || '') + ListElement(rand);
});

function ListElement(text) {
  return `
<li class="chat-list">${text}</li>
`;
}
