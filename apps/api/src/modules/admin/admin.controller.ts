import { Controller, Get, Post, Put, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  async getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('agents/pending')
  @ApiOperation({ summary: 'Get pending agent approvals' })
  async getPendingAgents() {
    return this.adminService.getPendingAgents();
  }

  @Post('agents/:id/approve')
  @ApiOperation({ summary: 'Approve an agent' })
  async approveAgent(@Param('id') id: string) {
    return this.adminService.approveAgent(id);
  }

  @Get('customs/pending')
  @ApiOperation({ summary: 'Get pending customs rate updates' })
  async getPendingRates() {
    return this.adminService.getPendingCustomsRates();
  }

  @Post('customs/:id/approve')
  @ApiOperation({ summary: 'Approve customs rate update' })
  async approveRate(@Param('id') id: string, @Req() req: any) {
    return this.adminService.approveCustomsRate(id, req.user.sub);
  }

  @Post('customs/:id/reject')
  @ApiOperation({ summary: 'Reject customs rate update' })
  async rejectRate(@Param('id') id: string) {
    return this.adminService.rejectCustomsRate(id);
  }

  @Get('shipping')
  @ApiOperation({ summary: 'Get all shipping rates' })
  async getShippingRates() {
    return this.adminService.getAllShippingRates();
  }

  @Put('shipping')
  @ApiOperation({ summary: 'Update shipping rate' })
  async updateShippingRate(@Body() body: { cityId: string; originPort: string; priceUsd: number }) {
    return this.adminService.updateShippingRate(body.cityId, body.originPort, body.priceUsd);
  }
}
