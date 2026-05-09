import { Controller, Get, Put, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getMe(@Req() req: any) {
    return this.usersService.findById(req.user.sub);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current user profile' })
  async updateMe(@Req() req: any, @Body() body: any) {
    return this.usersService.updateProfile(req.user.sub, body);
  }

  @Post('register-agent')
  @ApiOperation({ summary: 'Register as an agent' })
  async registerAsAgent(@Req() req: any, @Body() body: any) {
    return this.usersService.registerAsAgent(req.user.sub, body);
  }
}
