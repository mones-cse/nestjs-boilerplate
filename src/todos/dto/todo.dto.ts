import { z } from 'zod';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { todos } from '../../database/schema';

// Generate base schemas from Drizzle
export const selectTodoSchema = createSelectSchema(todos);
export const insertTodoSchema = createInsertSchema(todos);

// Create Todo DTO
export const createTodoSchema = z.object({
  title: z.string().min(1).max(255),
});

export type CreateTodoDto = z.infer<typeof createTodoSchema>;

// Update Todo DTO
export const updateTodoSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  completed: z.boolean().optional(),
});

export type UpdateTodoDto = z.infer<typeof updateTodoSchema>;

// Todo Response DTO
export const todoResponseSchema = selectTodoSchema.pick({
  id: true,
  title: true,
  completed: true,
  createdAt: true,
  updatedAt: true,
});

export type TodoResponse = z.infer<typeof todoResponseSchema>;
