import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { agent: true },
    });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
    const { password, ...result } = user;
    return result;
  }

  async updateProfile(id: string, data: { name?: string; country?: string; city?: string; phone?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true, email: true, name: true, role: true,
        country: true, city: true, phone: true, avatarUrl: true,
      },
    });
  }

  async registerAsAgent(userId: string, data: { companyName: string; address?: string; license?: string }) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { role: 'AGENT' },
    });

    const agent = await this.prisma.agent.create({
      data: {
        userId,
        companyName: data.companyName,
        address: data.address,
        license: data.license,
      },
    });

    return { user, agent };
  }
  async getAgents() {
    return this.prisma.agent.findMany({
      where: { isApproved: true },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAgentById(id: string) {
    const agent = await this.prisma.agent.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true, email: true, phone: true } },
      },
    });
    if (!agent) throw new NotFoundException('Agent topilmadi');
    return agent;
  }
}
