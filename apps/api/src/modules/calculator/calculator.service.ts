import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

// ==========================================
// Bojxona formulalari — 6 davlat uchun
// ==========================================

interface CalculationInput {
  carPriceUsd: number;
  engineCc: number;
  year: number;
  fuelType: string;
  condition: string;
}

interface CalculationBreakdown {
  carPrice: number;
  shipping: number;
  customsDuty: number;
  vat: number;
  excise: number;
  utilizationFee: number;
  registrationFee: number;
  insurance: number;
  additionalFees: number;
  total: number;
  currency: string;
  breakdown: Record<string, number>;
}

@Injectable()
export class CalculatorService {
  constructor(private prisma: PrismaService) {}

  async calculate(carId: string, countryCode: string, cityId: string): Promise<CalculationBreakdown> {
    // Get car details
    const car = await this.prisma.car.findUnique({ where: { id: carId } });
    if (!car) throw new NotFoundException('Mashina topilmadi');

    // Get shipping rate
    const shippingRate = await this.prisma.shippingRate.findFirst({
      where: { cityId },
    });

    // Get approved customs rate for country
    const country = await this.prisma.country.findFirst({
      where: { code: countryCode },
    });
    if (!country) throw new NotFoundException('Davlat topilmadi');

    const customsRate = await this.prisma.customsRate.findFirst({
      where: { countryId: country.id, status: 'APPROVED' },
      orderBy: { updatedAt: 'desc' },
    });

    const carPriceUsd = Number(car.priceUsd);
    const shippingUsd = shippingRate ? Number(shippingRate.priceUsd) : 0;
    const carAge = new Date().getFullYear() - car.year;

    const input: CalculationInput = {
      carPriceUsd,
      engineCc: car.engineCc,
      year: car.year,
      fuelType: car.fuelType,
      condition: car.condition,
    };

    // Calculate customs based on country
    const customs = this.calculateCustomsByCountry(countryCode, input, shippingUsd);

    // Insurance estimate (1.5-2% of car price)
    const insurance = Math.round(carPriceUsd * 0.018);

    const total = carPriceUsd + shippingUsd + customs.totalCustoms + insurance;

    return {
      carPrice: carPriceUsd,
      shipping: shippingUsd,
      customsDuty: customs.duty,
      vat: customs.vat,
      excise: customs.excise,
      utilizationFee: customs.utilizationFee,
      registrationFee: customs.registrationFee,
      insurance,
      additionalFees: customs.additionalFees,
      total: Math.round(total),
      currency: 'USD',
      breakdown: {
        'Mashina narxi': carPriceUsd,
        'Shipping (Korea → shahar)': shippingUsd,
        'Bojxona to\'lovi': customs.duty,
        'QQS (VAT)': customs.vat,
        'Aksiz': customs.excise,
        'Utilizatsiya to\'lovi': customs.utilizationFee,
        'Rasmiylash to\'lovi': customs.registrationFee,
        'Sug\'urta (taxminiy)': insurance,
        'Qo\'shimcha to\'lovlar': customs.additionalFees,
        'JAMI': Math.round(total),
      },
    };
  }

  private calculateCustomsByCountry(
    countryCode: string,
    input: CalculationInput,
    shippingUsd: number,
  ) {
    const cif = input.carPriceUsd + shippingUsd;
    const isElectric = input.fuelType === 'ELECTRIC';
    const carAge = new Date().getFullYear() - input.year;

    switch (countryCode) {
      case 'UZ':
        return this.calculateUzbekistan(cif, input, carAge, isElectric);
      case 'KZ':
        return this.calculateKazakhstan(cif, input, carAge, isElectric);
      case 'KG':
        return this.calculateKyrgyzstan(cif, input, carAge, isElectric);
      case 'TJ':
        return this.calculateTajikistan(cif, input, carAge, isElectric);
      case 'RU':
        return this.calculateRussia(cif, input, carAge, isElectric);
      case 'AE':
        return this.calculateDubai(cif, input, carAge, isElectric);
      default:
        return { duty: 0, vat: 0, excise: 0, utilizationFee: 0, registrationFee: 0, additionalFees: 0, totalCustoms: 0 };
    }
  }

  // O'ZBEKISTON: 15% bojxona + $0.40/sm3 (yangi), 30% + $0.40/sm3 (ishlatilgan)
  private calculateUzbekistan(cif: number, input: CalculationInput, carAge: number, isElectric: boolean) {
    const dutyPercent = carAge <= 1 ? 0.15 : 0.30;
    const duty = isElectric ? 0 : Math.round(cif * dutyPercent + input.engineCc * 0.40);
    const vat = Math.round(cif * 0.12);
    const registrationFee = 344; // ~10 BCU
    return {
      duty,
      vat,
      excise: 0,
      utilizationFee: 0,
      registrationFee,
      additionalFees: 0,
      totalCustoms: duty + vat + registrationFee,
    };
  }

  // QOZOG'ISTON: 15% bojxona, 12% QQS, aksiz 3000+ sm3
  private calculateKazakhstan(cif: number, input: CalculationInput, carAge: number, isElectric: boolean) {
    const duty = isElectric ? 0 : Math.round(cif * 0.15);
    const vat = Math.round(cif * 0.12);
    const excise = input.engineCc > 3000 ? Math.round(input.engineCc * 0.075) : 0; // 100 tenge/sm3 ≈ $0.075
    return {
      duty,
      vat,
      excise,
      utilizationFee: 0,
      registrationFee: 0,
      additionalFees: 0,
      totalCustoms: duty + vat + excise,
    };
  }

  // QIRG'IZISTON: 15% (10 yosh+), 12% QQS
  private calculateKyrgyzstan(cif: number, input: CalculationInput, carAge: number, isElectric: boolean) {
    const dutyPercent = carAge > 10 ? 0.15 : 0.20;
    const duty = isElectric ? 0 : Math.round(cif * dutyPercent);
    const vat = Math.round(cif * 0.12);
    const utilizationFee = carAge > 5 ? 500 : 0; // Utilizatsiya to'lovi
    return {
      duty,
      vat,
      excise: 0,
      utilizationFee,
      registrationFee: 0,
      additionalFees: 0,
      totalCustoms: duty + vat + utilizationFee,
    };
  }

  // TOJIKISTON: 20-30% bojxona, 18% QQS
  private calculateTajikistan(cif: number, input: CalculationInput, carAge: number, isElectric: boolean) {
    const dutyPercent = carAge > 5 ? 0.30 : 0.20;
    const duty = isElectric ? 0 : Math.round(cif * dutyPercent);
    const vat = Math.round(cif * 0.18);
    const excise = input.engineCc > 2500 ? Math.round(input.engineCc * 0.05) : 0;
    return {
      duty,
      vat,
      excise,
      utilizationFee: 0,
      registrationFee: 0,
      additionalFees: 0,
      totalCustoms: duty + vat + excise,
    };
  }

  // ROSSIYA: Murakkab formula + katta utilizatsiya
  private calculateRussia(cif: number, input: CalculationInput, carAge: number, isElectric: boolean) {
    let duty: number;
    if (carAge <= 3) {
      duty = Math.round(cif * 0.15);
    } else if (carAge <= 5) {
      duty = Math.round(input.engineCc * 2.5); // EUR/sm3 ≈ USD
    } else {
      duty = Math.round(input.engineCc * 3.5);
    }

    if (isElectric) duty = 0;

    const vat = Math.round(cif * 0.18); // ~18%

    // Utilizatsiya to'lovi (katta xarajat)
    let utilizationFee: number;
    if (input.engineCc <= 1000) utilizationFee = 3400;
    else if (input.engineCc <= 2000) utilizationFee = 5200;
    else if (input.engineCc <= 3000) utilizationFee = 7500;
    else utilizationFee = 12000;

    if (carAge > 3) utilizationFee *= 2; // Eski mashina uchun 2x

    return {
      duty,
      vat,
      excise: 0,
      utilizationFee,
      registrationFee: 0,
      additionalFees: 0,
      totalCustoms: duty + vat + utilizationFee,
    };
  }

  // DUBAY (BAA): 5% bojxona, 5% QQS
  private calculateDubai(cif: number, input: CalculationInput, carAge: number, isElectric: boolean) {
    const duty = isElectric ? 0 : Math.round(cif * 0.05);
    const vat = Math.round((cif + duty) * 0.05);
    const inspectionFee = 300; // AED 500-2000 ≈ $150-550
    return {
      duty,
      vat,
      excise: 0,
      utilizationFee: 0,
      registrationFee: inspectionFee,
      additionalFees: 0,
      totalCustoms: duty + vat + inspectionFee,
    };
  }

  // Davlatlar va shaharlar ro'yxati
  async getCountries() {
    return this.prisma.country.findMany({
      include: { cities: true },
      orderBy: { name: 'asc' },
    });
  }

  async getCitiesByCountry(countryCode: string) {
    const country = await this.prisma.country.findFirst({
      where: { code: countryCode },
    });
    if (!country) throw new NotFoundException('Davlat topilmadi');

    return this.prisma.city.findMany({
      where: { countryId: country.id },
      orderBy: { name: 'asc' },
    });
  }
}
