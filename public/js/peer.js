import SimplePeer from 'simple-peer';

export class Peer {
  constructor(initiator, sendSignal, receiveCallback) {
    this.connected = false;
    this.peer = new SimplePeer({
      initiator,
    });

    this.peer.on('error', (err) => {
      console.error('peer error', err);
    });
    this.peer.on('signal', (data) => {
      console.log('peer signal');
      sendSignal(data);
    });
    this.peer.on('connect', () => {
      console.log('peer connected');
      this.connected = true;
    });

    this.peer.on('data', (data) => {
      console.log('peer data');
      receiveCallback(data.toString());
    });
  }
  send(message) {
    if (this.connected) {
      this.peer.send(message);
      return true;
    }
    console.log('peer is not connected');
    return false;
  }
  signal(data) {
    this.peer.signal(data);
  }
}
