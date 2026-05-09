import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CalculatorService } from './calculator.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('calculator')
@Controller('calculator')
export class CalculatorController {
  constructor(private readonly calculatorService: CalculatorService) {}

  @Post('calculate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Calculate total import cost for a car' })
  async calculate(@Body() body: { carId: string; countryCode: string; cityId: string }) {
    return this.calculatorService.calculate(body.carId, body.countryCode, body.cityId);
  }

  @Get('countries')
  @ApiOperation({ summary: 'Get all supported countries with cities' })
  async getCountries() {
    return this.calculatorService.getCountries();
  }

  @Get('cities/:countryCode')
  @ApiOperation({ summary: 'Get cities by country code' })
  async getCities(@Param('countryCode') countryCode: string) {
    return this.calculatorService.getCitiesByCountry(countryCode);
  }
}
