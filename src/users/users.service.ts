import { Injectable } from '@nestjs/common';
import { db } from '../config/database.config';
import { users, type User, type NewUser } from '../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  async findById(id: number): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return result[0] || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return result[0] || null;
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.googleId, googleId))
      .limit(1);

    return result[0] || null;
  }

  async create(userData: NewUser): Promise<User> {
    const result = await db.insert(users).values(userData).returning();

    return result[0];
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string | null,
  ): Promise<void> {
    await db
      .update(users)
      .set({ refreshToken, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }
}
