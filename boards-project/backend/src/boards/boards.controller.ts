import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BoardsService } from './boards.service';

@Controller('boards')
@UseGuards(AuthGuard('jwt'))
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Get()
  getAll() {
    return this.boardsService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.boardsService.getOne(id);
  }

  @Post()
  create(@Req() req: any, @Body('title') title: string) {
    if (req.user.role !== 'ADMIN') throw new Error('Forbidden');
    return this.boardsService.create(title);
  }

  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body('title') title: string,
  ) {
    if (req.user.role !== 'ADMIN') throw new Error('Forbidden');
    return this.boardsService.update(id, title);
  }

  @Delete(':id')
  delete(@Req() req: any, @Param('id') id: string) {
    if (req.user.role !== 'ADMIN') throw new Error('Forbidden');
    return this.boardsService.delete(id);
  }
}
