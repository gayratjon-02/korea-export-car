import { Controller, Get, Post, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('rooms')
  @ApiOperation({ summary: 'Create or get chat room' })
  async createRoom(@Req() req: any, @Body() body: { agentId: string; carId: string; calculationData?: any }) {
    return this.chatService.createRoom(req.user.sub, body.agentId, body.carId, body.calculationData);
  }

  @Get('rooms')
  @ApiOperation({ summary: 'Get user chat rooms' })
  async getRooms(@Req() req: any) {
    return this.chatService.getUserRooms(req.user.sub);
  }

  @Get('rooms/:roomId/messages')
  @ApiOperation({ summary: 'Get room messages' })
  async getMessages(
    @Param('roomId') roomId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.chatService.getRoomMessages(roomId, page, limit);
  }

  @Get('unread')
  @ApiOperation({ summary: 'Get unread message count' })
  async getUnreadCount(@Req() req: any) {
    return this.chatService.getUnreadCount(req.user.sub);
  }
}
