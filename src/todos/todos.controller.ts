import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  createTodoSchema,
  updateTodoSchema,
  type CreateTodoDto,
  type UpdateTodoDto,
  type TodoResponse,
} from './dto/todo.dto';
import type { User } from '../database/schema';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('api/v1/todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createTodoSchema)) createTodoDto: CreateTodoDto,
    @Req() req: RequestWithUser,
  ): Promise<TodoResponse> {
    const todo = await this.todosService.create(req.user.id, createTodoDto);
    return {
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    };
  }

  @Get()
  async findAll(@Req() req: RequestWithUser): Promise<TodoResponse[]> {
    const todos = await this.todosService.findAll(req.user.id);
    return todos.map((todo) => ({
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    }));
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ): Promise<TodoResponse> {
    const todo = await this.todosService.findOne(id, req.user.id);
    return {
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateTodoSchema)) updateTodoDto: UpdateTodoDto,
    @Req() req: RequestWithUser,
  ): Promise<TodoResponse> {
    const todo = await this.todosService.update(id, req.user.id, updateTodoDto);
    return {
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ): Promise<{ message: string }> {
    await this.todosService.remove(id, req.user.id);
    return { message: 'Todo deleted successfully' };
  }
}
