import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/schemas/User.schema';
import { JwtAuthGuard } from 'src/auth/guards/JwtAuthGuard';
import { updateUserDto } from './dto/updateUser.dto';
import { Roles } from 'src/auth/dto/changeRole.dto';
import { AdminGuard } from 'src/auth/guards/roleGuard';
import { Response } from 'express';

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
  async getUserById(@Req() req): Promise<User> {
    return this.userService.getUserById(req.user.sub);
  }

  @Patch('change-role')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async changeUserRole(
    @Body() changeRole: Roles & { userId: string }
  ): Promise<User> {
    return this.userService.changeUserRole(changeRole, changeRole.userId);
  }

  

  @UseGuards(JwtAuthGuard)
  @Post('/delete')
  async deleteAccount(@Req() req, res: Response ): Promise<any> {
    return this.userService.deleteAccount(req.user.sub, res);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/')
  async updateCurrentUser(
    @Req() req,
    @Body()
    updateData: updateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(req.user.sub, updateData);
  }
}
