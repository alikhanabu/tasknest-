import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(name: string, email: string, password: string, res: Response) {
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) throw new ConflictException('Email already in use');
    const hash = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { name, email, password: hash },
    });
    return this.signAndSetCookies(user.id, user.email, user.role, res);
  }

  async login(email: string, password: string, res: Response) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    return this.signAndSetCookies(user.id, user.email, user.role, res);
  }

  async refresh(token: string, res: Response) {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token },
    });
    if (!stored) throw new UnauthorizedException('Invalid refresh token');
    await this.prisma.refreshToken.delete({ where: { token } });
    const user = await this.prisma.user.findUnique({
      where: { id: stored.userId },
    });
    if (!user) throw new UnauthorizedException('User not found');
    return this.signAndSetCookies(user.id, user.email, user.role, res);
  }

  async logout(userId: string, res: Response) {
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return { message: 'Logged out' };
  }

  async getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  private async signAndSetCookies(
    userId: string,
    email: string,
    role: string,
    res: Response,
  ) {
    const accessToken = this.jwt.sign({ sub: userId, email, role });
    const refreshToken = uuidv4();
    await this.prisma.refreshToken.create({
      data: { token: refreshToken, userId },
    });
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { message: 'ok', role };
  }
}
