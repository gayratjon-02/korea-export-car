import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CarsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: {
    brand?: string;
    model?: string;
    yearFrom?: number;
    yearTo?: number;
    engineCcFrom?: number;
    engineCcTo?: number;
    priceFrom?: number;
    priceTo?: number;
    fuelType?: string;
    condition?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const skip = (page - 1) * limit;

    const where: Prisma.CarWhereInput = {
      isActive: true,
      ...(filters.brand && { brand: { contains: filters.brand, mode: 'insensitive' as any } }),
      ...(filters.model && { model: { contains: filters.model, mode: 'insensitive' as any } }),
      ...(filters.yearFrom && { year: { gte: filters.yearFrom } }),
      ...(filters.yearTo && { year: { ...((filters.yearFrom && { gte: filters.yearFrom }) || {}), lte: filters.yearTo } }),
      ...(filters.engineCcFrom && { engineCc: { gte: filters.engineCcFrom } }),
      ...(filters.engineCcTo && { engineCc: { ...((filters.engineCcFrom && { gte: filters.engineCcFrom }) || {}), lte: filters.engineCcTo } }),
      ...(filters.priceFrom && { priceUsd: { gte: filters.priceFrom } }),
      ...(filters.priceTo && { priceUsd: { ...((filters.priceFrom && { gte: filters.priceFrom }) || {}), lte: filters.priceTo } }),
      ...(filters.fuelType && { fuelType: filters.fuelType as any }),
      ...(filters.condition && { condition: filters.condition as any }),
    };

    const orderBy: Prisma.CarOrderByWithRelationInput = {};
    if (filters.sortBy) {
      (orderBy as any)[filters.sortBy] = filters.sortOrder || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [items, total] = await Promise.all([
      this.prisma.car.findMany({
        where,
        include: {
          media: { orderBy: { sortOrder: 'asc' } },
          agent: { include: { user: { select: { name: true, avatarUrl: true } } } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.car.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    const car = await this.prisma.car.findUnique({
      where: { id },
      include: {
        media: { orderBy: { sortOrder: 'asc' } },
        agent: { include: { user: { select: { id: true, name: true, avatarUrl: true } } } },
      },
    });
    if (!car) throw new NotFoundException('Mashina topilmadi');

    // Increment view count
    await this.prisma.car.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return car;
  }

  async create(agentId: string, data: any) {
    return this.prisma.car.create({
      data: {
        agentId,
        brand: data.brand,
        model: data.model,
        year: data.year,
        engineCc: data.engineCc,
        fuelType: data.fuelType,
        priceKrw: data.priceKrw,
        priceUsd: data.priceUsd,
        condition: data.condition || 'USED',
        mileage: data.mileage,
        color: data.color,
        transmission: data.transmission,
        description: data.description,
      },
      include: { media: true },
    });
  }

  async update(id: string, agentId: string, data: any) {
    const car = await this.prisma.car.findUnique({ where: { id } });
    if (!car) throw new NotFoundException('Mashina topilmadi');
    if (car.agentId !== agentId) throw new ForbiddenException('Bu mashina sizga tegishli emas');

    return this.prisma.car.update({
      where: { id },
      data,
      include: { media: true },
    });
  }

  async delete(id: string, agentId: string) {
    const car = await this.prisma.car.findUnique({ where: { id } });
    if (!car) throw new NotFoundException('Mashina topilmadi');
    if (car.agentId !== agentId) throw new ForbiddenException('Bu mashina sizga tegishli emas');

    return this.prisma.car.delete({ where: { id } });
  }

  async addMedia(carId: string, agentId: string, mediaData: { url: string; type: string; sortOrder?: number }) {
    const car = await this.prisma.car.findUnique({ where: { id: carId } });
    if (!car) throw new NotFoundException('Mashina topilmadi');
    if (car.agentId !== agentId) throw new ForbiddenException('Bu mashina sizga tegishli emas');

    return this.prisma.carMedia.create({
      data: {
        carId,
        url: mediaData.url,
        type: mediaData.type,
        sortOrder: mediaData.sortOrder || 0,
      },
    });
  }

  async getAgentCars(agentId: string) {
    return this.prisma.car.findMany({
      where: { agentId },
      include: { media: { orderBy: { sortOrder: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBrands() {
    const brands = await this.prisma.car.findMany({
      where: { isActive: true },
      select: { brand: true },
      distinct: ['brand'],
      orderBy: { brand: 'asc' },
    });
    return brands.map((b) => b.brand);
  }
}
