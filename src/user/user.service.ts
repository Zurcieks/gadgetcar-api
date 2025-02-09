import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { updateUserDto } from './dto/updateUser.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/jwt/jwt-strategy';

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
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

  async deleteAccount(userId: string): Promise<any> {
    const user = await this.userModel.findByIdAndDelete(userId);

    if (!user) {
      throw new UnauthorizedException(
        `Nie znaleziono użytkownika o ID: ${userId} lub token jest nieprawidłowy`,
      );
    }

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
