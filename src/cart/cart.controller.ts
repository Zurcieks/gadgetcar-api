import { Controller, Get, Post, Body, Param, Delete, Request, UseGuards, Put, BadRequestException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AddItemCommand } from './commands/add-item.command';
import { UpdateItemCommand } from './commands/update-item.command';
import { RemoveItemCommand } from './commands/remove-item.command';
import { ClearCartCommand } from './commands/clear-cart.command';
import { GetCartQuery } from './queries/get-cart.query';
import { Types } from 'mongoose';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { OptionalJwtAuthGuard } from 'src/auth/guards/OptionalAuthGuard';
import { MergeCartsCommand } from './commands/merge-cart.command';
import { JwtAuthGuard } from 'src/auth/guards/JwtAuthGuard';
 

@Controller('cart')
@UseGuards(OptionalJwtAuthGuard)
export class CartController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @Get()
  async getCart(@Request() req) {
    const userId = req.user.sub;
    return this.queryBus.execute(
      new GetCartQuery(
        userId.startsWith('anonymous') ? userId : new Types.ObjectId(userId)
      )
    );
  }

  @Post('add')
  async addItem(@Request() req, @Body() addItemDto: AddItemDto) {
    const userId = req.user.sub;
    return this.commandBus.execute(
      new AddItemCommand(
        userId.startsWith('anonymous') ? userId : new Types.ObjectId(userId),
        new Types.ObjectId(addItemDto.productId),
        addItemDto.quantity
      )
    );
  }

  @Put('update/:productId')
  async updateItem(
    @Request() req,
    @Param('productId') productId: string,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    const userId = req.user.sub;
    return this.commandBus.execute(
      new UpdateItemCommand(
        userId.startsWith('anonymous') ? userId : new Types.ObjectId(userId),
        new Types.ObjectId(productId),
        updateItemDto.quantity
      )
    );
  }

  @Delete('remove/:productId')
  async removeItem(@Request() req, @Param('productId') productId: string) {
    const userId = req.user.sub;
    return this.commandBus.execute(
      new RemoveItemCommand(
        userId.startsWith('anonymous') ? userId : new Types.ObjectId(userId),
        new Types.ObjectId(productId)
      )
    );
  }

  @Delete('clear')
  async clearCart(@Request() req) {
    const userId = req.user.sub;
    return this.commandBus.execute(
      new ClearCartCommand(
        userId.startsWith('anonymous') ? userId : new Types.ObjectId(userId)
      )
    );
  }
  @Post('merge')
  @UseGuards(JwtAuthGuard) // Add this to ensure we have an authenticated user
  async mergeCarts(@Request() req, @Body('anonymousUserId') anonymousUserId: string) {
    if (!anonymousUserId) {
      throw new BadRequestException('Anonymous user ID is required');
    }
    const loggedInUserId = req.user.sub;
    console.log('Merging carts:', { anonymousUserId, loggedInUserId });
    return this.commandBus.execute(
      new MergeCartsCommand(anonymousUserId, loggedInUserId)
    );
  }
  
}
  
