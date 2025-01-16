import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';

export interface JwtPayload {
    sub: string;    
    email: string;  
    role: string;   
  }
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req.cookies['auth'],  // Pobieramy token z ciasteczka 'Authentication'
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRETKEY  // Twoje klucz sekretu, który musisz mieć w .env
    });
  }

  async validate(payload: JwtPayload) {
    return this.authService.validateUserById(payload.sub);
 
  }
}
