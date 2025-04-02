import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:3000', {
  transports: ['websocket'],
  autoConnect: false,
  reconnection: true, 
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

export default socket;