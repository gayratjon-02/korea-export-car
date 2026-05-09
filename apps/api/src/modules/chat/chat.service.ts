import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createRoom(userId: string, agentId: string, carId: string, calculationData?: any) {
    // Check if room already exists
    const existing = await this.prisma.chatRoom.findFirst({
      where: { userId, agentId, carId },
    });

    if (existing) {
      // Update calculation data if provided
      if (calculationData) {
        return this.prisma.chatRoom.update({
          where: { id: existing.id },
          data: { calculationData },
          include: { messages: { orderBy: { createdAt: 'desc' }, take: 50 } },
        });
      }
      return this.prisma.chatRoom.findUnique({
        where: { id: existing.id },
        include: { messages: { orderBy: { createdAt: 'desc' }, take: 50 } },
      });
    }

    return this.prisma.chatRoom.create({
      data: {
        userId,
        agentId,
        carId,
        calculationData,
      },
      include: { messages: true },
    });
  }

  async sendMessage(roomId: string, senderId: string, content: string, type: string = 'TEXT', mediaUrl?: string) {
    const room = await this.prisma.chatRoom.findUnique({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Chat xonasi topilmadi');

    const message = await this.prisma.message.create({
      data: {
        roomId,
        senderId,
        content,
        type: type as any,
        mediaUrl,
      },
    });

    // Update last message time
    await this.prisma.chatRoom.update({
      where: { id: roomId },
      data: { lastMessageAt: new Date() },
    });

    return message;
  }

  async getRoomMessages(roomId: string, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    return this.prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        sender: { select: { id: true, name: true, avatarUrl: true, role: true } },
      },
    });
  }

  async getUserRooms(userId: string) {
    return this.prisma.chatRoom.findMany({
      where: {
        OR: [{ userId }, { agentId: userId }],
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
        agent: { select: { id: true, name: true, avatarUrl: true } },
        car: { select: { id: true, brand: true, model: true, year: true, media: { take: 1 } } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { lastMessageAt: 'desc' },
    });
  }

  async markAsRead(roomId: string, userId: string) {
    return this.prisma.message.updateMany({
      where: {
        roomId,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.message.count({
      where: {
        room: {
          OR: [{ userId }, { agentId: userId }],
        },
        senderId: { not: userId },
        isRead: false,
      },
    });
  }
}
