import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import { RateLimiterMemory } from 'rate-limiter-flexible';

@Injectable()
export class RateLimiterGuard implements CanActivate {
  private rateLimiter: RateLimiterMemory;

  constructor() {
    this.rateLimiter = new RateLimiterMemory({
      points: 3, // Liczba dozwolonych żądań
      duration: 24 * 60 * 60, 
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip; // Pobranie adresu IP

    try {
      await this.rateLimiter.consume(ip); // Zmniejszenie dostępnych punktów dla adresu IP
      return true; // Jeśli limit nie został osiągnięty, przepuszczamy żądanie
    } catch (err) {
      throw new BadRequestException(
        'Osiągnięto limit żądań, spróbuj ponownie później.',
      );
    }
  }
}
