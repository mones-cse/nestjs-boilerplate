import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import type { UsersService } from '../users/users.service';
import {
  googleUserSchema,
  type GoogleUserDto,
  type AuthResponse,
} from './dto/auth.dto';
import type { User } from '../database/schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateGoogleUser(googleUser: GoogleUserDto): Promise<User> {
    // Validate input with Zod
    const validatedData = googleUserSchema.parse(googleUser);

    // Check if user exists by Google ID
    let user = await this.usersService.findByGoogleId(validatedData.googleId);

    if (user) {
      return user;
    }

    // Check if user exists by email
    user = await this.usersService.findByEmail(validatedData.email);

    if (user) {
      // User exists but hasn't linked Google account
      throw new UnauthorizedException(
        'An account with this email already exists. Please login with your existing method.',
      );
    }

    // Create new user
    return this.usersService.create({
      email: validatedData.email,
      name: validatedData.name || null,
      googleId: validatedData.googleId,
      picture: validatedData.picture || null,
    });
  }

  async login(user: User): Promise<AuthResponse> {
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    });

    // Save refresh token to database
    await this.usersService.updateRefreshToken(user.id, refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
      accessToken,
    };
  }

  async refreshTokens(
    userId: number,
    refreshToken: string,
  ): Promise<AuthResponse> {
    const user = await this.usersService.findById(userId);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Verify refresh token matches
    if (user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Generate new tokens
    return this.login(user);
  }

  async logout(userId: number): Promise<void> {
    await this.usersService.updateRefreshToken(userId, null);
  }
}
