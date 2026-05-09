import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(email: string, password: string, name: string, role: Role = Role.USER) {
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Bu email allaqachon ro\'yxatdan o\'tgan');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      throw new UnauthorizedException('Email yoki parol noto\'g\'ri');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email yoki parol noto\'g\'ri');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async googleLogin(googleUser: { email: string; name: string; googleId: string; avatarUrl?: string }) {
    let user = await this.prisma.user.findUnique({
      where: { googleId: googleUser.googleId },
    });

    if (!user) {
      user = await this.prisma.user.findUnique({
        where: { email: googleUser.email },
      });

      if (user) {
        // Link Google account to existing user
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: googleUser.googleId,
            avatarUrl: googleUser.avatarUrl || user.avatarUrl,
          },
        });
      } else {
        // Create new user
        user = await this.prisma.user.create({
          data: {
            email: googleUser.email,
            name: googleUser.name,
            googleId: googleUser.googleId,
            avatarUrl: googleUser.avatarUrl,
            role: Role.USER,
          },
        });
      }
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async refreshToken(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Foydalanuvchi topilmadi');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return tokens;
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { agent: true },
    });
    if (!user) {
      throw new UnauthorizedException('Foydalanuvchi topilmadi');
    }
    return this.sanitizeUser(user);
  }

  private async generateTokens(userId: string, email: string, role: Role) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '1d' }),
      this.jwtService.signAsync(payload, { expiresIn: '30d' }),
    ]);

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: any) {
    const { password, ...result } = user;
    return result;
  }
}
