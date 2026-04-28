"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const uuid_1 = require("uuid");
let AuthService = class AuthService {
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async register(name, email, password, res) {
        const exists = await this.prisma.user.findUnique({ where: { email } });
        if (exists)
            throw new common_1.ConflictException('Email already in use');
        const hash = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: { name, email, password: hash },
        });
        return this.signAndSetCookies(user.id, user.email, user.role, res);
    }
    async login(email, password, res) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const valid = await bcrypt.compare(password, user.password);
        if (!valid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        return this.signAndSetCookies(user.id, user.email, user.role, res);
    }
    async refresh(token, res) {
        const stored = await this.prisma.refreshToken.findUnique({
            where: { token },
        });
        if (!stored)
            throw new common_1.UnauthorizedException('Invalid refresh token');
        await this.prisma.refreshToken.delete({ where: { token } });
        const user = await this.prisma.user.findUnique({
            where: { id: stored.userId },
        });
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        return this.signAndSetCookies(user.id, user.email, user.role, res);
    }
    async logout(userId, res) {
        await this.prisma.refreshToken.deleteMany({ where: { userId } });
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return { message: 'Logged out' };
    }
    async getMe(userId) {
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
    async signAndSetCookies(userId, email, role, res) {
        const accessToken = this.jwt.sign({ sub: userId, email, role });
        const refreshToken = (0, uuid_1.v4)();
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map