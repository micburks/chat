import fs from 'fs';
import path from 'path';

// use file as a database to store JSON
export default class Database {
  constructor() {
    this.dir = path.resolve('.data');
    ensureDir(this.dir);
  }
  // get all rows
  async getAll(table) {
    let tablePath = path.join(this.dir, table);
    return read(tablePath);
  }
  // get row by id
  async get(table, id) {
    let tablePath = path.join(this.dir, table);
    let rows = await read(tablePath);
    return rows.find((chat) => chat.id === id);
  }
  // update existing row
  async update(table, row) {
    await this.delete(table, row);
    return this.insert(table, row);
  }
  // insert new row
  async insert(table, ...rows) {
    let tablePath = path.join(this.dir, table);
    let data = await read(tablePath);
    data = [...data, ...rows];
    return write(tablePath, data);
  }
  // delete row
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
