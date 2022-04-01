#!/usr/bin/env node

import {createServer} from 'http';
import path from 'path';

import {Server as staticServer} from 'node-static';

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
  request
    .addListener('end', function () {
      file.serve(request, response);
    })
    .resume();
}).listen(port, host, () => {
  const addr = server.address();
  console.log(`listening on ${addr.address}:${addr.port}`);
});
