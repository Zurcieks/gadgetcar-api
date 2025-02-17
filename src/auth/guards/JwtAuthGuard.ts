import { Injectable, ExecutionContext } from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../jwt/jwt-strategy'; 

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['auth'];  // Pobieramy token JWT z ciasteczka

    if (!token) {
      return false;  // Jeśli token nie istnieje, dostęp jest zabroniony
    }

    try {
 
      const decoded: JwtPayload = this.jwtService.verify(token);  

 
      request.user = decoded;
      return true;  
    } catch (e) {
      return false; 
    }
  }
}
