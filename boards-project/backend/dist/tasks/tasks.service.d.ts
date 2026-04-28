import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus } from '@prisma/client';
export declare class TasksService {
    private prisma;
    constructor(prisma: PrismaService);
    getAll(): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.TaskStatus;
        boardId: string;
    })[]>;
    create(userId: string, boardId: string, title: string, description?: string): import(".prisma/client").Prisma.Prisma__TaskClient<{
        user: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.TaskStatus;
        boardId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: {
        title?: string;
        description?: string;
        status?: TaskStatus;
    }): import(".prisma/client").Prisma.Prisma__TaskClient<{
        user: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.TaskStatus;
        boardId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    delete(id: string): import(".prisma/client").Prisma.Prisma__TaskClient<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.TaskStatus;
        boardId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
