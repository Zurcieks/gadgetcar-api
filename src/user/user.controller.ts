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
 

  @UseGuards(JwtAuthGuard)
  @Post('/delete')
  async deleteAccount(@Req() req): Promise<any> {
    return this.userService.deleteAccount(req.user.sub);
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
