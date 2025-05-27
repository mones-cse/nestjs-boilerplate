import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import type { User } from '../database/schema';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  changePasswordSchema,
  LoginDto,
  loginSchema,
  refreshTokenSchema,
  RegisterDto,
  registerSchema,
} from './dto/auth.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

// Extend Express Request to include user
interface RequestWithUser extends Request {
  user: User;
}

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body(new ZodValidationPipe(registerSchema)) registerDto: RegisterDto,
  ) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body(new ZodValidationPipe(loginSchema)) loginDto: LoginDto) {
    return this.authService.loginWithPassword(loginDto);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body(new ZodValidationPipe(changePasswordSchema))
    changePasswordDto: ChangePasswordDto,
    @Req() req: RequestWithUser,
  ) {
    await this.authService.changePassword(req.user.id, changePasswordDto);
    return { message: 'Password changed successfully' };
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {
    // Guard redirects to Google
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    const authResponse = await this.authService.login(req.user);

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', authResponse.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Redirect to frontend with access token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    // res.redirect(`${frontendUrl}/dashboard?token=${authResponse.accessToken}`);
    res.redirect(
      `${frontendUrl}/auth/callback?token=${authResponse.accessToken}`,
    );
  }

  @Post('refresh')
  async refreshToken(
    @Body(new ZodValidationPipe(refreshTokenSchema))
    body: {
      refreshToken: string;
    },
  ) {
    // Extract user ID from refresh token
    try {
      const payload = this.authService['jwtService'].verify(body.refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });

      return this.authService.refreshTokens(payload.sub, body.refreshToken);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token', error.message);
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: RequestWithUser, @Res() res: Response) {
    await this.authService.logout(req.user.id);
    res.clearCookie('refreshToken');
    return res.json({ message: 'Logged out successfully' });
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: RequestWithUser) {
    return {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      picture: req.user.picture,
      emailVerified: req.user.emailVerified,
      hasPassword: !!req.user.password,
      hasGoogleAccount: !!req.user.googleId,
    };
  }
}
