import fs from 'fs';
import path from 'path';

export default class Database {
  constructor() {
    this.dir = path.resolve('.data');
    ensureDir(this.dir);
  }
  async getAll(table) {
    let tablePath = path.join(this.dir, table);
    return read(tablePath);
  }
  async get(table, id) {
    let tablePath = path.join(this.dir, table);
    let rows = await read(tablePath);
    return rows.find((chat) => (chat.id = id));
  }
  async insert(table, ...rows) {
    let tablePath = path.join(this.dir, table);
    let data = await read(tablePath);
    data = [...data, ...rows];
    return write(tablePath, data);
  }
  async delete(table, row) {
    let tablePath = path.join(this.dir, table);
    let data = await read(tablePath);
    data = data.filter((r) => r.id !== row.id);
    return write(tablePath, data);
  }
}

async function read(file) {
  if (fs.existsSync(file)) {
    return JSON.parse(await fs.promises.readFile(file, 'utf-8'));
  } else {
    return [];
  }
}

async function write(file, data) {
  return fs.promises.writeFile(file, JSON.stringify(data));
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {recursive: true});
  }
}
