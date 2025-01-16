import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role || !user.role.includes('admin')) {
      throw new ForbiddenException('Brak odpowiednich uprawnień. Wymagana rola: admin');
    }

    return true;
  }
}
