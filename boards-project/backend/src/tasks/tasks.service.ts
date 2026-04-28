import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  getAll() {
    return this.prisma.task.findMany({
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(userId: string, boardId: string, title: string, description?: string) {
    return this.prisma.task.create({
      data: { title, description, boardId, userId },
      include: { user: { select: { id: true, name: true } } },
    });
  }

  update(
    id: string,
    data: { title?: string; description?: string; status?: TaskStatus },
  ) {
    return this.prisma.task.update({
      where: { id },
      data,
      include: { user: { select: { id: true, name: true } } },
    });
  }

  delete(id: string) {
    return this.prisma.task.delete({ where: { id } });
  }
}
