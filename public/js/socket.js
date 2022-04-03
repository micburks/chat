/* eslint-env browser */
import {io} from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js';

export class Socket {
  constructor(receiveSignal) {
    this.socket = io(location.host);
    this.connected = false;

    this.socket.on('connect', () => {
      this.status = 'connected';
      this.connected = true;
      this.id = this.socket.id;
      console.log('socket connected', this.socket.id);
    });
    this.socket.on('disconnect', () => {
      this.connected = false;
      console.log('socket diconnected', this.socket.id);
    });
    this.socket.on('signal', (data) => {
      console.log('socket signal');
      receiveSignal(data);
    });
  }
  emit(...args) {
    this.socket.emit(...args);
  }
}
