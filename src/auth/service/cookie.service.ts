import { Injectable } from '@nestjs/common';
import { Response } from 'express';
@Injectable()
export class CookieService {
  setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
    rememberMe: boolean,
  ) {
    res.cookie('auth', accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 15 * 60 * 1000, // 15 minut
      sameSite: 'none',
      partitioned: true,
    });

    res.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000, // 30 dni lub 7 dni
      sameSite: 'none',
      partitioned: true,
    });
  }

  DeleteCookies(
    res: Response,
  ) {
    res.clearCookie('auth', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      partitioned: true
    });
    res.clearCookie('refresh-token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      partitioned: true
    });
  }
}
