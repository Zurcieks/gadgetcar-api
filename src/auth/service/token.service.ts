import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateVerificationToken(userId: string): string {
    return this.jwtService.sign({ _id: userId }, { expiresIn: '1h' });
  }

  generateTokens(
    userId: string,
    email: string,
    role: string,
    rememberMe: boolean,
  ) {
    const payload = { sub: userId, email, role };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    const refreshToken = crypto.randomBytes(40).toString('hex');
    const refreshTokenExpires = new Date(
      rememberMe
        ? Date.now() + 30 * 24 * 60 * 60 * 1000
        : Date.now() + 7 * 24 * 60 * 60 * 1000,
    );

    return { accessToken, refreshToken, refreshTokenExpires };
  }

  generateAccessToken(userId: string, email: string, role: string): string {
    const payload = { sub: userId, email, role };
    return this.jwtService.sign(payload, { expiresIn: '15m' });
  }

  generateResetPasswordToken(userId: string): string {
    return this.jwtService.sign({ _id: userId }, { expiresIn: '1h' });
}
}
