import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/schemas/User.schema';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RateLimiterGuard } from './guards/rate-limiterGuard';
import { Request } from 'express';
@Controller('auth')
export class AuthController {
  userModel: any;
  constructor(private authService: AuthService) {}
  @UseGuards(RateLimiterGuard)
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<User> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res() res: Response,
    @Body('rememberMe') rememberMe: boolean = false,
  ) {
    return this.authService.login(loginDto, res, rememberMe);
  }

  @Post('refresh')
  async refreshToken(@Req() req: Request, @Res() res: Response): Promise<void> {
    const refreshToken = req.cookies['refresh-token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token nie został dostarczony');
    }

    try {
      await this.authService.refreshAccessToken(refreshToken, res);
    } catch (error) {
      throw new UnauthorizedException(
        'Nieprawidłowy lub wygasły refresh token',
      );
    }
  }

  @Get('verify')
  async verifyEmail(@Query('token') token: string): Promise<String> {
    return this.authService.confirmEmail(token);
  }
  @UseGuards(RateLimiterGuard)
  @Post('request-reset-password')
  async requestPasswordReset(
    @Body() dto: RequestResetPasswordDto,
  ): Promise<String> {
    return this.authService.requestPassword(dto);
  }
  @UseGuards(RateLimiterGuard)
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<String> {
    return this.authService.resetPassword(dto);
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
    const refreshToken = req.cookies['refresh-token'];

    if (!refreshToken) {
      res.status(400).json({ message: 'Brak tokena odświeżania w żądaniu' });
      return;
    }
    try {
      await this.authService.logout(refreshToken, res);

      res.status(200).json({ message: 'Wylogowano pomyślnie' });
    } catch (error) {
      console.error('Błąd podczas wylogowywania:', error);
      res.status(500).json({
        message:
          'Wystąpił błąd podczas wylogowywania. Spróbuj ponownie później.',
      });
    }
  }
}
