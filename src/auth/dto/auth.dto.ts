import { z } from 'zod';

// Google OAuth user data
export const googleUserSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  googleId: z.string(),
  picture: z.string().url().optional(),
});

export type GoogleUserDto = z.infer<typeof googleUserSchema>;

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
