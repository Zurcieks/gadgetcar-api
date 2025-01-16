import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { User } from 'src/schemas/User.schema';
import { JwtAuthGuard } from 'src/auth/guards/JwtAuthGuard';
import { updateUserDto } from './dto/updateUser.dto';
import { RateLimiterGuard } from 'src/auth/guards/rate-limiterGuard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getUser(): Promise<User[]> {
    const users = await this.userService.getUser();
    return users;
  }
  @UseGuards(JwtAuthGuard)
  @Get('id')
  async getUserById(
    @Req() req: Request,

  ): Promise<User> {
    const token = req.cookies['auth'];

    if (!token) {
      throw new NotFoundException(
        'Token JWT nie został dostarczony w ciasteczku',
      );
    }

    try {
      const user = await this.userService.getUserById(token);

      return user;
    } catch (error) {
      throw new NotFoundException(
        'Nieprawidłowy token lub użytkownik nie znaleziony',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/delete')
  async deleteAccount(@Req() req: any): Promise<any> {
      const token = req.cookies['auth'];
      if(!token) {
        throw new NotFoundException("Brak tokenu")
      }
      try {
        return await this.userService.deleteAccount(token)
      } catch(error) {
        throw new NotFoundException('Nieprawidłowy token lub użytkownik nie znaleziony')
      }
  }

  @UseGuards(JwtAuthGuard, RateLimiterGuard )
  @Patch('/')
  async updateCurrentUser(
    @Req() req: Request, @Body()
    updateData: updateUserDto,
  ): Promise<User> {
    const token = req.cookies['auth'];
    if (!token) {
      throw new NotFoundException(
        'Token JWT nie został dostarczony w ciasteczku',
      );
    }
    try {
      return await this.userService.updateUser(token, updateData);
    } catch (error) {
      throw new NotFoundException(
        'Nieprawidłowy token lub użytkownik nie znaleziony',
      );
    }
  }

   
}
