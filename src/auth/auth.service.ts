import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import type { User } from '../database/schema';
import { UsersService } from '../users/users.service';
import {
  googleUserSchema,
  type AuthResponse,
  type ChangePasswordDto,
  type GoogleUserDto,
  type LoginDto,
  type RegisterDto,
} from './dto/auth.dto';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const newUser = await this.usersService.create({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name || null,
      emailVerified: false, // Email verification can be implemented later
    });

    return this.login(newUser);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null; // User not found
    }

    if (!user.password) {
      return null; // No password set for user
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null; // Invalid password
    }

    return user; // User is valid
  }

  async loginWithPassword(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.login(user);
  }

  async changePassword(
    userId: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.usersService.findById(userId);

    if (!user || !user.password) {
      throw new BadRequestException('Cannot change password for this account');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      10,
    );

    // Update password
    await this.usersService.updatePassword(userId, hashedNewPassword);
  }

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
      // User exists with email/password, link Google account
      await this.usersService.linkGoogleAccount(
        user.id,
        validatedData.googleId,
        validatedData.picture || null,
      );
      return user;
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

  async setInitialPassword(userId: number, newPassword: string): Promise<void> {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Check if user already has a password
    if (user.password) {
      throw new BadRequestException(
        'Password already set. Use change password instead.',
      );
    }

    // User must have Google auth to set initial password
    if (!user.googleId) {
      throw new BadRequestException(
        'Cannot set password without alternative authentication method',
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.usersService.updatePassword(userId, hashedPassword);
  }
}
