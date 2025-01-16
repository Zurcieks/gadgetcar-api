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
      // Dekodujemy token i weryfikujemy go
      const decoded: JwtPayload = this.jwtService.verify(token);  

      // Przechowujemy dane użytkownika w kontekście żądania
      request.user = decoded;
      return true;  // Jeśli token jest poprawny, dostęp do zasobu jest dozwolony
    } catch (e) {
      return false;  // Jeśli token jest nieprawidłowy, dostęp jest zabroniony
    }
  }
}
