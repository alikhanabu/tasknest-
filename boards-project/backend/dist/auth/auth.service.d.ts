import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from 'express';
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    register(name: string, email: string, password: string, res: Response): Promise<{
        message: string;
        role: string;
    }>;
    login(email: string, password: string, res: Response): Promise<{
        message: string;
        role: string;
    }>;
    refresh(token: string, res: Response): Promise<{
        message: string;
        role: string;
    }>;
    logout(userId: string, res: Response): Promise<{
        message: string;
    }>;
    getMe(userId: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
    }>;
    private signAndSetCookies;
}
