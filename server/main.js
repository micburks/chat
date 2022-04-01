#!/usr/bin/env node

import {createServer} from 'http';
import path from 'path';

import {Server as staticServer} from 'node-static';
import {Server as Socket} from 'socket.io';

import renderHtml from './render.js';

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
io.on('connection', (client) => {
  console.log('connection');
  client.on('event', (data) => {
    console.log('event', data);
  });
  client.on('disconnect', () => {
    console.log('disconnect');
  });
  client.on('create-chat', async (creatorId, callback) => {
    const chat = createChat(creatorId);
    callback(chat.id);
  });
  client.on('join-chat', async (creatorId, callback) => {
  });
});

function createChat(creatorId) {
  const chat = {
    id: Math.random().toFixed(7).substring(2),
    members: [creatorId],
  };
  return chat;
}
