import {Peer} from './peer.js';
import {Socket} from './socket.js';

export class Chat {
  constructor(receiveMessage) {
    this.peer = null;
    this.id = null;
    this.socket = new Socket(this.receiveSignal.bind(this));
    this.receiveMessage = receiveMessage;
  }
  create(callback) {
    this.peer = new Peer(
      false,
      this.sendSignal.bind(this),
      this.receiveMessage
    );
    this.socket.emit('create-chat', this.socket.id, (chatId) => {
      this.id = chatId;
      callback(this.id);
    });
  }
  join(id, callback) {
    this.peer = new Peer(true, this.sendSignal.bind(this), this.receiveMessage);
    this.id = id;
    this.socket.emit(
      'join-chat',
      {id: this.socket.id, chatId: this.id},
      (approved) => {
        if (approved) {
          callback(this.id);
        }
      }
    );
  }
  sendMessage(msg) {
    if (this.peer) {
      this.peer.send(msg);
    }
  }
  // bridge peer/socket - signal comes from peer, need to send socket
  sendSignal(data) {
    this.socket.emit('signal', {
      chatId: this.id,
      senderId: this.socket.id,
      data,
    });
  }
  // bridge peer/socket - signal comes from signal, need to send to peer
  receiveSignal(data) {
    this.peer.signal(data);
  }
}
