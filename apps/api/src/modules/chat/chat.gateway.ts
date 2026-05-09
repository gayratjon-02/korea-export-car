import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private onlineUsers = new Map<string, string>(); // userId -> socketId

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.onlineUsers.set(userId, client.id);
      this.server.emit('userOnline', { userId });
      console.log(`🟢 User connected: ${userId}`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = [...this.onlineUsers.entries()]
      .find(([, socketId]) => socketId === client.id)?.[0];
    if (userId) {
      this.onlineUsers.delete(userId);
      this.server.emit('userOffline', { userId });
      console.log(`🔴 User disconnected: ${userId}`);
    }
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string }) {
    client.join(data.roomId);
    console.log(`📌 User joined room: ${data.roomId}`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string }) {
    client.leave(data.roomId);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {
      roomId: string;
      senderId: string;
      content: string;
      type?: string;
      mediaUrl?: string;
    },
  ) {
    const message = await this.chatService.sendMessage(
      data.roomId,
      data.senderId,
      data.content,
      data.type || 'TEXT',
      data.mediaUrl,
    );

    // Broadcast to room
    this.server.to(data.roomId).emit('newMessage', message);
    return message;
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; userId: string; isTyping: boolean },
  ) {
    client.to(data.roomId).emit('userTyping', {
      userId: data.userId,
      isTyping: data.isTyping,
    });
  }

  @SubscribeMessage('markRead')
  async handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; userId: string },
  ) {
    await this.chatService.markAsRead(data.roomId, data.userId);
    this.server.to(data.roomId).emit('messagesRead', {
      roomId: data.roomId,
      userId: data.userId,
    });
  }

  isUserOnline(userId: string): boolean {
    return this.onlineUsers.has(userId);
  }
}
