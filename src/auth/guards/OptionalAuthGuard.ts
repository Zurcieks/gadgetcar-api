import { Injectable, ExecutionContext } from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['auth'];

    if (!token) {
      request.user = { sub: request.sessionID || 'anonymous' };
      return true;
    }

    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded;
      return true;
    } catch (e) {
      request.user = { sub: request.sessionID || 'anonymous' };
      return true;
    }
  }
}