#!/usr/bin/env node

import {promises as __fs} from 'fs';
import __path from 'path';
import __util from 'util';
import __cp from 'child_process';
import * as __helpers from './helpers/index.js';

/* eslint-disable no-unused-vars */
const pathJoin = __path.join;
const pathResolve = __path.resolve;
const pathDirname = __path.dirname;
const pathBasename = __path.basename;

const readDir = __fs.readdir;
const readDirVerbose = __helpers.readDirVerbose;
const readFile = __fs.readFile;
const writeFile = __fs.writeFile;
const copyFile = __fs.copyFile;

const exec = __util.promisify(__cp.exec); // usage
const spawn = __util.promisify(__cp.spawn); // usage
const execFile = __util.promisify(__cp.execFile); // usage

const prompt = __helpers.prompt;
/* eslint-enable */

// cli args/options
const args = __helpers.args;
const options = __helpers.options;

console.log('new script', {args, options});
