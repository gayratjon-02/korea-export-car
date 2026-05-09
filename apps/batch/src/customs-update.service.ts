import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CustomsUpdateService {
  private readonly logger = new Logger(CustomsUpdateService.name);
  private prisma = new PrismaClient();
  private anthropic: Anthropic;

  private readonly countries = [
    { code: 'UZ', name: "O'zbekiston" },
    { code: 'KZ', name: 'Qozog\'iston' },
    { code: 'KG', name: 'Qirg\'iziston' },
    { code: 'TJ', name: 'Tojikiston' },
    { code: 'RU', name: 'Rossiya' },
    { code: 'AE', name: 'Dubai (BAA)' },
  ];

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get('ANTHROPIC_API_KEY');
    if (apiKey) {
      this.anthropic = new Anthropic({ apiKey });
    }
  }

  // Haftada bir marta — Dushanba kechasi 02:00
  @Cron('0 2 * * 1')
  async handleWeeklyUpdate() {
    this.logger.log('🔄 Haftalik bojxona ma\'lumotlarini yangilash boshlandi...');

    for (const country of this.countries) {
      try {
        await this.updateCountryCustoms(country.code, country.name);
        this.logger.log(`✅ ${country.name} bojxona ma'lumotlari yangilandi (draft)`);
      } catch (error) {
        this.logger.error(`❌ ${country.name} yangilashda xato:`, error);
      }
    }

    this.logger.log('🏁 Haftalik yangilash tugadi. Admin tasdiqlashini kutmoqda.');
  }

  private async updateCountryCustoms(countryCode: string, countryName: string) {
    if (!this.anthropic) {
      this.logger.warn('Anthropic API key yo\'q, o\'tkazib yuborildi');
      return;
    }

    const prompt = `You are a customs duty research assistant. 
    
Please provide the current (2026) customs duty rates for importing cars from South Korea to ${countryName}.

Return the data in the following JSON format:
{
  "baseDutyPercent": <number>,
  "engineCcRate": <number or null>,
  "vatPercent": <number>,
  "exciseRate": <number or null>,
  "usedCarMultiplier": <number or null>,
  "electricExemption": <boolean>,
  "utilizationFee": <number or null>,
  "additionalFees": {},
  "notes": "<string with any important notes>"
}

Only return the JSON, no other text.`;

    const message = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = (message.content[0] as any).text;

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI javobidan JSON parse qilib bo\'lmadi');
    }

    const formulaData = JSON.parse(jsonMatch[0]);

    // Find country in DB
    const country = await this.prisma.country.findFirst({
      where: { code: countryCode },
    });

    if (!country) {
      throw new Error(`Davlat topilmadi: ${countryCode}`);
    }

    // Save as draft
    await this.prisma.customsRate.create({
      data: {
        countryId: country.id,
        formulaData,
        status: 'DRAFT',
        source: 'ai_batch',
        notes: `AI batch orqali yangilangan: ${new Date().toISOString()}`,
      },
    });
  }
}
