import { AuthService } from './auth.service';
import { Request, Response } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: {
        name: string;
        email: string;
        password: string;
    }, res: Response): Promise<{
        message: string;
        role: string;
    }>;
    login(body: {
        email: string;
        password: string;
    }, res: Response): Promise<{
        message: string;
        role: string;
    }>;
    refresh(req: Request, res: Response): Promise<{
        message: string;
        role: string;
    }>;
    logout(req: any, res: Response): Promise<{
        message: string;
    }>;
    getMe(req: any): Promise<{
        id: string;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
    }>;
}
