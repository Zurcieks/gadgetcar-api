import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { updateUserDto } from './dto/updateUser.dto';
import { Response } from 'express';
import { Roles } from 'src/auth/dto/changeRole.dto';
import { CookieService } from 'src/auth/service/cookie.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly cookieService: CookieService
  ) {}

  async getUser(): Promise<User[]> {
    return this.userModel.find();
  }

  async getUserById(userId: string): Promise<User> {
    try {
      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new UnauthorizedException(
          'Nieprawidłowy token lub użytkownik nie istnieje',
        );
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException(
        'Nieprawidłowy token lub użytkownik nie znaleziony',
      );
    }
  }
  async changeUserRole(changeRole: Roles, userId: string): Promise<User> {
    const { userRoles } = changeRole;
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('Użytkownik nie znaleziony');
    }

    user.role = userRoles[0];
    await user.save();
    return user;
  }
  async deleteAccount(userId: string, res: Response): Promise<any> {
    const user = await this.userModel.findByIdAndDelete(userId);

    if (!user) {
      throw new UnauthorizedException(
        `Nie znaleziono użytkownika o ID: ${userId} lub token jest nieprawidłowy`,
      );
    }
    this.cookieService.DeleteCookies(res);
    return user;
  }

  async updateUser(userId: string, updateDto: updateUserDto): Promise<User> {
    try {
      const user = await this.userModel.findByIdAndUpdate(userId, updateDto);

      if (!user) {
        throw new UnauthorizedException(
          `Nie znaleziono użytkownika o ID: ${userId} lub token jest nieprawidłowy`,
        );
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException(
        'Nieprawidłowy token lub użytkownik nie znaleziony',
      );
    }
  }
}
