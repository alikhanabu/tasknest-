import { PrismaService } from '../prisma/prisma.service';
export declare class BoardsService {
    private prisma;
    constructor(prisma: PrismaService);
    getAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        title: string;
    }[]>;
    getOne(id: string): import(".prisma/client").Prisma.Prisma__BoardClient<{
        tasks: ({
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
        })[];
    } & {
        id: string;
        createdAt: Date;
        title: string;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    create(title: string): import(".prisma/client").Prisma.Prisma__BoardClient<{
        id: string;
        createdAt: Date;
        title: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, title: string): import(".prisma/client").Prisma.Prisma__BoardClient<{
        id: string;
        createdAt: Date;
        title: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    delete(id: string): import(".prisma/client").Prisma.Prisma__BoardClient<{
        id: string;
        createdAt: Date;
        title: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
