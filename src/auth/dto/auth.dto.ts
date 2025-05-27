import { z } from 'zod';

// Google OAuth user data
export const googleUserSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  googleId: z.string(),
  picture: z.string().url().optional(),
});

export type GoogleUserDto = z.infer<typeof googleUserSchema>;

// Email/Password registration
export const registerSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must not exceed 100 characters'),
  name: z.string().min(2).max(50).optional(),
});
export type RegisterDto = z.infer<typeof registerSchema>;

// Email/Password login
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});
export type LoginDto = z.infer<typeof loginSchema>;

// Change password
export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(6, 'Current password must be at least 6 characters long'),
  newPassword: z
    .string()
    .min(6, 'New password must be at least 6 characters long')
    .max(100, 'New password must not exceed 100 characters'),
});
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;

// JWT payload
export const jwtPayloadSchema = z.object({
  sub: z.number(), // user id
  email: z.string().email(),
});

export type JwtPayload = z.infer<typeof jwtPayloadSchema>;

// Refresh token
export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;

// Auth response
export const authResponseSchema = z.object({
  user: z.object({
    id: z.number(),
    email: z.string().email(),
    name: z.string().nullable(),
    picture: z.string().nullable(),
  }),
  accessToken: z.string(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
