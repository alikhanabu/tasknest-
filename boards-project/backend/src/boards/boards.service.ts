import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) {}

  getAll() {
    return this.prisma.board.findMany({ orderBy: { createdAt: 'desc' } });
  }

  getOne(id: string) {
    return this.prisma.board.findUnique({
      where: { id },
      include: {
        tasks: { include: { user: { select: { id: true, name: true } } } },
      },
    });
  }

  create(title: string) {
    return this.prisma.board.create({ data: { title } });
  }

  update(id: string, title: string) {
    return this.prisma.board.update({ where: { id }, data: { title } });
  }

  delete(id: string) {
    return this.prisma.board.delete({ where: { id } });
  }
}
