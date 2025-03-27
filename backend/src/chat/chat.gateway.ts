import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  @WebSocketGateway({ 
    cors: { 
      origin: '*',
      methods: ["GET", "POST"]
    } 
  })
  export class ChatGateway {
    @WebSocketServer()
    server: Server;
  
    @SubscribeMessage('message')
    handleMessage(
      @MessageBody() data: { senderId: string; receiverId: string; content: string, createdAt: Date },
      @ConnectedSocket() client: Socket,
    ) {
      console.log(`Message received from ${data.senderId} to ${data.receiverId}: ${data.content}`);
      this.server.to(data.receiverId).emit('message', data);
    }
  
    @SubscribeMessage('join')
    handleJoin(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
      client.join(userId);
      console.log(`User ${userId} joined`);
    }
  }
  