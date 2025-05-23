import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || '';

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

// For query purposes
const queryClient = postgres(connectionString);
export const db = drizzle(queryClient);

// For migrations
export const migrationClient = postgres(connectionString, { max: 1 });
