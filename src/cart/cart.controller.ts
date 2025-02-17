import { Controller, Get, Post, Body, Param, Delete, Request, UseGuards, Put } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AddItemCommand } from './commands/add-item.command';
import { UpdateItemCommand } from './commands/update-item.command';
import { RemoveItemCommand } from './commands/remove-item.command';
import { ClearCartCommand } from './commands/clear-cart.command';
import { GetCartQuery } from './queries/get-cart.query';
import { Types } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards/JwtAuthGuard';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { RemoveItemDto } from './dto/remove-item.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

 
  @Get()
  async getCart(@Request() req) {
    return this.queryBus.execute(new GetCartQuery(new Types.ObjectId(req.user.sub)));
  }

 
  @Post('add')
  async addItem(@Request() req, @Body() addItemDto: AddItemDto) {
    return this.commandBus.execute(
      new AddItemCommand(new Types.ObjectId(req.user.sub), new Types.ObjectId(addItemDto.productId), addItemDto.quantity),
    );
  }

 
  @Put('update/:productId')
  async updateItem(
    @Request() req,
    @Param('productId') productId: string,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return this.commandBus.execute(
      new UpdateItemCommand(new Types.ObjectId(req.user.sub), new Types.ObjectId(productId), updateItemDto.quantity),
    );
  }

 
  @Delete('remove/:productId')
  async removeItem(@Request() req, @Param('productId') productId: string, @Body() removeItemDto: RemoveItemDto) {
    return this.commandBus.execute(
      new RemoveItemCommand(new Types.ObjectId(req.user.sub), new Types.ObjectId(removeItemDto.productId)),
    );
  }
 
  @Delete('clear')
  async clearCart(@Request() req) {
    return this.commandBus.execute(new ClearCartCommand(new Types.ObjectId(req.user.sub)));
  }
}
