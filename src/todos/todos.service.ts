import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../config/database.config';
import { todos, type Todo, type NewTodo } from '../database/schema';
import { eq, and } from 'drizzle-orm';
import type { CreateTodoDto, UpdateTodoDto } from './dto/todo.dto';

@Injectable()
export class TodosService {
  async create(userId: number, createTodoDto: CreateTodoDto): Promise<Todo> {
    const newTodo: NewTodo = {
      ...createTodoDto,
      userId,
    };

    const result = await db.insert(todos).values(newTodo).returning();

    return result[0];
  }

  async findAll(userId: number): Promise<Todo[]> {
    return db
      .select()
      .from(todos)
      .where(eq(todos.userId, userId))
      .orderBy(todos.createdAt);
  }

  async findOne(id: number, userId: number): Promise<Todo> {
    const result = await db
      .select()
      .from(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, userId)))
      .limit(1);

    if (!result[0]) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return result[0];
  }

  async update(
    id: number,
    userId: number,
    updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    const result = await db
      .update(todos)
      .set({
        ...updateTodoDto,
        updatedAt: new Date(),
      })
      .where(and(eq(todos.id, id), eq(todos.userId, userId)))
      .returning();
    if (!result[0]) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return result[0];
  }

  async remove(id: number, userId: number): Promise<void> {
    const result = await db
      .delete(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, userId)))
      .returning();

    if (result.length === 0) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
  }
}
