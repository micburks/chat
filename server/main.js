#!/usr/bin/env node

import {createServer} from 'http';
import path from 'path';

import {Server as staticServer} from 'node-static';
import {Server as Socket} from 'socket.io';

import renderHtml from './render.js';
import Database from './db.js';

// cli args/options parsing - bootstrapped from `micburks/js`
const args = [];
const options = {};
let __cursor = null;
for (const arg of process.argv.slice(2)) {
  if (arg.startsWith('-')) {
    __cursor = arg.replace(/^--?/, '');
    options[__cursor] = true;
  } else if (__cursor) {
    options[__cursor] = arg;
    __cursor = null;
  } else {
    args.push(arg);
  }
}

const file = new staticServer('./public', {cache: 0});
const port = options.port || 8080;
const host = '0.0.0.0';
const db = new Database();

const server = createServer(async (request, response) => {
  // server render
  if (request.url === '/') {
    response.writeHead(200, {'Content-Type': 'text/html'});
    return response.end(
      await renderHtml(path.resolve('./server/templates/index.html'))
    );
  }

  // static file server
  request
    .addListener('end', function () {
      file.serve(request, response);
    })
    .resume();

  // cleanup
  function close() {
    server.close();
    process.exit();
  }
  process.on('SIGINT', close);
  process.on('SIGTERM', close);
}).listen(port, host, () => {
  const addr = server.address();
  console.log(`listening on ${addr.address}:${addr.port}`);
});

const io = new Socket(server);
const clientCache = {};
io.on('connection', (client) => {
  client.on('disconnect', async () => {
    /*
    const cl = Object.entries(clientCache).find(
      ([, value]) => value === client
    );
    if (!cl) {
      console.log('disconnect?');
      return;
    }
    const [clientId] = cl;
    console.log('disconnect', clientId);
    delete clientCache[clientId];
    const chats = await db.getAll('chat');
    for (const chat of chats) {
      if (chat.members.includes(clientId)) {
        console.log('member includes', chat);
        await db.update('chat', {
          ...chat,
          members: chat.members.filter((mem) => mem !== clientId),
        });
      }
    }
    */
  });
  client.on('create-chat', async (creatorId, callback) => {
    clientCache[creatorId] = client;
    const chat = createChat(creatorId);
    await db.insert('chat', chat);
    callback(chat.id);
  });
  client.on('join-chat', async ({id, chatId}, callback) => {
    clientCache[id] = client;
    const chat = await db.get('chat', chatId);
    // TODO: some process to approve joining this chat
    await db.update('chat', {
      ...chat,
      members: [...chat.members, id],
    });
    callback(true);
  });
  client.on('signal', async ({chatId, senderId, data}) => {
    const chat = await db.get('chat', chatId);
    if (!chat || !chat.members) {
      return;
    }
    for (const member of chat.members) {
      if (member === senderId) {
        continue;
      }
      if (clientCache[member]) {
        clientCache[member].emit('signal', data);
      }
    }
  });
});

function createChat(creatorId) {
  const chat = {
    id: Math.random().toFixed(7).substring(2),
    members: [creatorId],
  };
  return chat;
}
