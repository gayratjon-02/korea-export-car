import { Controller, Get, Put, Post, Body, Req, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getMe(@Req() req: any) {
    return this.usersService.findById(req.user.sub);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  async updateMe(@Req() req: any, @Body() body: any) {
    return this.usersService.updateProfile(req.user.sub, body);
  }

  @Post('register-agent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register as an agent' })
  async registerAsAgent(@Req() req: any, @Body() body: any) {
    return this.usersService.registerAsAgent(req.user.sub, body);
  }
  @Get('agents')
  @ApiOperation({ summary: 'Get all approved agents' })
  async getAgents() {
    return this.usersService.getAgents();
  }

  @Get('agents/:id')
  @ApiOperation({ summary: 'Get specific agent details' })
  async getAgentById(@Param('id') id: string) {
    return this.usersService.getAgentById(id);
  }
}
