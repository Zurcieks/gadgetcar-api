import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getUserById(token: string): Promise<User> {
    try {
      const decoded: JwtPayload = this.jwtService.verify(token);

      const userId = decoded.sub;

      const user = await this.userModel.findById(userId).exec();

      if (!user) {
        throw new NotFoundException(
          `Nie znaleziono użytkownika o ID: ${userId}`,
        );
      }

      return user;
    } catch (error) {
      throw new NotFoundException(
        'Nieprawidłowy token lub użytkownik nie znaleziony',
      );
    }
  }

  async deleteAccount(token: string): Promise<any> {
    const decoded: JwtPayload = this.jwtService.verify(token);

    const userId = decoded.sub;

    const user = await this.userModel.findByIdAndDelete(userId);

    return user;
  }

  async updateUser(token: string, updateDto: updateUserDto): Promise<User> {
    try {
      const decoded: JwtPayload = this.jwtService.verify(token);

      const userId = decoded.sub;

      const user = await this.userModel.findByIdAndUpdate(userId, updateDto);

      if (!user) {
        throw new NotFoundException(
          `Nie znaleziono użytkownika o ID: ${userId}`,
        );
      }

      return user;
    } catch (error) {
      throw new NotFoundException(
        'Nieprawidłowy token lub użytkownik nie znaleziony',
      );
    }
  }
}
