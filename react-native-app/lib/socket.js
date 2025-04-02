import { io, Socket } from 'socket.io-client';

const socket= io('http://192.168.0.179', {
  transports: ['websocket'],
  autoConnect: false,
  reconnection: true, 
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

export default socket;