import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, Req, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CarsService } from './cars.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@kci/types';

@ApiTags('cars')
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cars with filters' })
  @ApiQuery({ name: 'brand', required: false })
  @ApiQuery({ name: 'model', required: false })
  @ApiQuery({ name: 'yearFrom', required: false, type: Number })
  @ApiQuery({ name: 'yearTo', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(@Query() query: any) {
    return this.carsService.findAll(query);
  }

  @Get('brands')
  @ApiOperation({ summary: 'Get all available brands' })
  async getBrands() {
    return this.carsService.getBrands();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get car by ID' })
  async findById(@Param('id') id: string) {
    return this.carsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new car listing (Agent only)' })
  async create(@Req() req: any, @Body() body: any) {
    // Get agent ID from user
    return this.carsService.create(req.user.sub, body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a car listing (Agent only)' })
  async update(@Param('id') id: string, @Req() req: any, @Body() body: any) {
    return this.carsService.update(id, req.user.sub, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a car listing (Agent only)' })
  async delete(@Param('id') id: string, @Req() req: any) {
    return this.carsService.delete(id, req.user.sub);
  }

  @Post(':id/media')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add media to car (Agent only)' })
  async addMedia(@Param('id') id: string, @Req() req: any, @Body() body: any) {
    return this.carsService.addMedia(id, req.user.sub, body);
  }

  @Get('agent/my-cars')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my cars (Agent only)' })
  async getMyCars(@Req() req: any) {
    return this.carsService.getAgentCars(req.user.sub);
  }
}
