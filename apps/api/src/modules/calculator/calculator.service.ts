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

export interface CalculationBreakdown {
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

  async calculate(
    carId: string | undefined, 
    countryCode: string, 
    cityId: string,
    manualCar?: CalculationInput
  ): Promise<CalculationBreakdown> {
    
    let input: CalculationInput;
    let carPriceUsd: number;

    if (carId) {
      // Get car details from DB
      const car = await this.prisma.car.findUnique({ where: { id: carId } });
      if (!car) throw new NotFoundException('Mashina topilmadi');
      carPriceUsd = Number(car.priceUsd);
      input = {
        carPriceUsd,
        engineCc: car.engineCc,
        year: car.year,
        fuelType: car.fuelType,
        condition: car.condition,
      };
    } else if (manualCar) {
      // Use manually provided car details (e.g. from parsed URL)
      input = manualCar;
      carPriceUsd = manualCar.carPriceUsd;
    } else {
      throw new Error('carId yoki manualCar taqdim etilishi shart');
    }

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

    const shippingUsd = shippingRate ? Number(shippingRate.priceUsd) : 0;

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

  // ===================================================================
  // QIRG'IZISTON — Rasmiy bojxona jadvali (2026 yil boshi, EVRO 103, USD 87.5)
  // ===================================================================
  private calculateKyrgyzstan(cif: number, input: CalculationInput, carAge: number, isElectric: boolean) {
    if (isElectric) {
      return { duty: 0, vat: 0, excise: 0, utilizationFee: 0, registrationFee: 0, additionalFees: 0, totalCustoms: 0 };
    }

    const fuelType = input.fuelType?.toLowerCase() || 'gasoline';
    const year = input.year;
    const cc = input.engineCc;

    let customsDuty = 0;

    if (fuelType === 'hybrid') {
      // GIBRID — faqat 3 yillik mashinalar uchun (2026/2025/2024/2023), Koreya narxlari
      if (year >= 2023) {
        if (cc <= 1801) customsDuty = 4088;
        else if (cc <= 2000) customsDuty = 4088;
        else if (cc <= 2500) customsDuty = 7300;
        else customsDuty = 10220;
      } else {
        // 3 yildan katta gibridlar — benzin jadvalidek hisoblanadi
        customsDuty = this.kyrgyzGasolineLookup(year, cc);
      }
    } else if (fuelType === 'diesel') {
      customsDuty = this.kyrgyzDieselLookup(year, cc);
    } else {
      // BENZIN (va LPG ham benzin jadvali bo'yicha)
      customsDuty = this.kyrgyzGasolineLookup(year, cc);
    }

    return {
      duty: customsDuty,
      vat: 0, // Jadvalda boj allaqachon QQS bilan birgalikda berilgan
      excise: 0,
      utilizationFee: 0,
      registrationFee: 0,
      additionalFees: 0,
      totalCustoms: customsDuty,
    };
  }

  // BENZIN jadvali — cc bo'yicha eng yaqin ustunni topadi
  private kyrgyzGasolineLookup(year: number, cc: number): number {
    // Ustunlar: 1.0, 1.4, 1.5, 1.6, 1.8, 2.0, 2.4, 2.5, 3.0, 3.3, 3.5, 4.0, 4.2, 4.4, 5.7, 6.2
    const ccBuckets = [1000, 1400, 1500, 1600, 1800, 2000, 2400, 2500, 3000, 3300, 3500, 4000, 4200, 4400, 5700, 6200];

    // Har bir yil uchun [1.0, 1.4, 1.5, 1.6, 1.8, 2.0, 2.4, 2.5, 3.0, 3.3, 3.5, 4.0, 4.2, 4.4, 5.7, 6.2]
    const table: Record<number, number[]> = {
      2026: [1782, 2494, 2672, 2850, 3206, 3562, 4275, 4453, 5344, 5878, 6234, 7125, 7481, 7837, 10153, 11043],
      2025: [1633, 2285, 2448, 2612, 2938, 3265, 3917, 4081, 4897, 5387, 5713, 6529, 6856, 7182, 9304, 10120],
      2024: [1487, 2081, 2229, 2378, 2675, 2973, 3567, 3715, 4459, 4905, 5202, 5945, 6242, 6540, 8472, 9215],
      2023: [1351, 1890, 2025, 2160, 2430, 2700, 3241, 3376, 4051, 5068, 5143, 6143, 6451, 6758, 8754, 9522],
      2022: [1201, 1681, 1801, 1921, 2161, 2401, 2881, 3002, 3602, 4892, 5189, 5930, 6227, 6523, 8450, 9192],
      2021: [1051, 1471, 1576, 1682, 1892, 2102, 2522, 2627, 3153, 4716, 5717, 6003, 6288, 6288, 8146, 8861],
      2020: [898, 1257, 1347, 1437, 1616, 2155, 2155, 2245, 2694, 4536, 4811, 5499, 5773, 6048, 7835, 8523],
      2019: [2161, 3210, 3439, 3879, 4364, 6431, 7717, 8039, 9646, 14962, 15868, 18135, 19042, 19949, 25843, 28110],
      2018: [2098, 3121, 3344, 3778, 4250, 6304, 7565, 7881, 9457, 14753, 15647, 17882, 18777, 19671, 25482, 27718],
      2017: [2035, 3033, 3249, 3677, 4136, 6178, 7414, 7722, 9267, 15426, 15426, 17629, 18511, 19392, 25122, 27326],
      2016: [2791, 4091, 4384, 4887, 5498, 7691, 9229, 9613, 11536, 17040, 18073, 18073, 21688, 22721, 29433, 32015],
      2015: [2791, 4091, 4384, 4887, 5498, 7691, 9229, 9613, 11536, 17040, 18073, 18073, 21688, 22721, 29433, 32015],
      2014: [3324, 4838, 5184, 5740, 6458, 8757, 10509, 10946, 13136, 18800, 19939, 22788, 23927, 23927, 32473, 35321],
    };

    // Eng yaqin yilni topish
    const yearKey = this.findClosestYear(year, Object.keys(table).map(Number));
    const row = table[yearKey];

    // Eng yaqin cc ni topish
    const colIdx = this.findClosestCcIndex(cc, ccBuckets);

    return row[colIdx];
  }

  // DIZEL jadvali
  private kyrgyzDieselLookup(year: number, cc: number): number {
    // Ustunlar: 1.6, 1.7, 2.0, 2.2, 2.5, 2.7, 3.3
    const ccBuckets = [1600, 1700, 2000, 2200, 2500, 2700, 3300];

    const table: Record<number, number[]> = {
      2026: [2850, 3028, 3562, 3919, 4455, 4809, 5878],
      2025: [2612, 2775, 3265, 3591, 4082, 4407, 5387],
      2024: [2378, 2527, 2973, 3270, 3717, 4013, 4905],
      2023: [2160, 2295, 2700, 2971, 7226, 7436, 8069],
      2022: [1921, 2041, 2401, 2641, 3708, 4003, 4892],
      2021: [1682, 1787, 2102, 2312, 3574, 3859, 4716],
      2020: [1636, 1636, 1640, 1745, 3438, 3712, 4536],
      2019: [5176, 5466, 6336, 6916, 11339, 12241, 14962],
      2018: [5044, 5359, 6304, 6935, 11181, 12071, 14753],
      2017: [4942, 5251, 6178, 6796, 11023, 11023, 14544],
      2016: [6153, 6537, 7691, 8460, 12915, 13942, 17040],
      2015: [6153, 6537, 7691, 8460, 12915, 13942, 17040],
      2014: [7006, 7444, 8757, 9633, 14248, 15382, 18800],
    };

    const yearKey = this.findClosestYear(year, Object.keys(table).map(Number));
    const row = table[yearKey];
    const colIdx = this.findClosestCcIndex(cc, ccBuckets);

    return row[colIdx];
  }

  // Yordamchi — eng yaqin yil
  private findClosestYear(year: number, years: number[]): number {
    if (year >= 2026) return 2026;
    if (year <= 2014) return 2014;
    // Aniq yil bormi?
    if (years.includes(year)) return year;
    // Aks holda eng yaqin pastdagi yilni topamiz
    const sorted = years.sort((a, b) => b - a);
    for (const y of sorted) {
      if (year >= y) return y;
    }
    return sorted[sorted.length - 1];
  }

  // Yordamchi — eng yaqin cc ustun indeksi
  private findClosestCcIndex(cc: number, buckets: number[]): number {
    // Agar eng kichikdan kichik bo'lsa — eng kichik ustun
    if (cc <= buckets[0]) return 0;
    // Agar eng kattadan katta bo'lsa — eng katta ustun
    if (cc >= buckets[buckets.length - 1]) return buckets.length - 1;
    // O'rtadagi eng yaqin qiymatni topish
    let closest = 0;
    let minDiff = Math.abs(cc - buckets[0]);
    for (let i = 1; i < buckets.length; i++) {
      const diff = Math.abs(cc - buckets[i]);
      if (diff < minDiff) {
        minDiff = diff;
        closest = i;
      }
    }
    return closest;
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

  async parseUrl(url: string) {
    try {
      // Simple fetch to get basic meta tags to simulate smart scraping
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const html = await res.text();
      
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : 'Noma\'lum mashina';
      
      const imgMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i);
      const imageUrl = imgMatch ? imgMatch[1] : null;

      // Extract year from title if possible (e.g. "2020 Kia K5")
      const yearMatch = title.match(/(201[0-9]|202[0-9])/);
      const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear() - 3;

      // Make realistic fake data based on URL text
      // In production, we'd use a real API like Encar API or Cheerio DOM parsing
      const engineCcMatch = html.match(/([1-4])\.[0-9]\s*(liter|l|cc)/i);
      const engineCc = engineCcMatch ? parseFloat(engineCcMatch[1]) * 1000 : 2000;

      return {
        brand: title.split(' ')[0] || 'Unknown',
        model: title.substring(0, 50),
        year,
        engineCc,
        carPriceUsd: 15000, // Hardcoded estimate
        fuelType: 'GASOLINE',
        condition: 'USED',
        imageUrl: imageUrl || 'https://via.placeholder.com/400x300?text=KCI+Parsed+Car'
      };
    } catch (error) {
      throw new Error('URL orqali ma\'lumot olishda xatolik. URL to\'g\'riligini tekshiring.');
    }
  }
}
