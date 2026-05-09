import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalUsers, totalAgents, totalCars, totalChats, pendingRates] = await Promise.all([
      this.prisma.user.count({ where: { role: 'USER' } }),
      this.prisma.agent.count(),
      this.prisma.car.count({ where: { isActive: true } }),
      this.prisma.chatRoom.count(),
      this.prisma.customsRate.count({ where: { status: 'DRAFT' } }),
    ]);
    return { totalUsers, totalAgents, totalCars, totalChats, pendingRates };
  }

  async getPendingAgents() {
    return this.prisma.agent.findMany({
      where: { isApproved: false },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  async approveAgent(agentId: string) {
    return this.prisma.agent.update({ where: { id: agentId }, data: { isApproved: true } });
  }

  async getPendingCustomsRates() {
    return this.prisma.customsRate.findMany({
      where: { status: 'DRAFT' },
      include: { country: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approveCustomsRate(rateId: string, adminId: string) {
    return this.prisma.customsRate.update({
      where: { id: rateId },
      data: { status: 'APPROVED', approvedBy: adminId, approvedAt: new Date() },
    });
  }

  async rejectCustomsRate(rateId: string) {
    return this.prisma.customsRate.update({
      where: { id: rateId },
      data: { status: 'REJECTED' },
    });
  }

  async updateShippingRate(cityId: string, originPort: string, priceUsd: number) {
    return this.prisma.shippingRate.upsert({
      where: { cityId_originPort: { cityId, originPort } },
      update: { priceUsd },
      create: { cityId, originPort, priceUsd },
    });
  }

  async getAllShippingRates() {
    return this.prisma.shippingRate.findMany({
      include: { city: { include: { country: true } } },
      orderBy: { city: { country: { name: 'asc' } } },
    });
  }
}
