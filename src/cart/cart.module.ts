import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';

import { CartRepository } from './repository/cart.repository';
import { ProductRepository } from './repository/product.repository';
import { CartController } from './cart.controller';
import { AddItemHandler } from './commands/handlers/add-item.handler';
import { GetCartHandler } from './queries/handlers/get-card.handler';
import { Cart, CartSchema } from 'src/schemas/Cart.schema';
import { Product, ProductSchema } from 'src/schemas/Products.schema';
import { ClearCartHandler } from './commands/handlers/clear-cart.handler';
import { RemoveItemHandler } from './commands/handlers/remove-item.handler';
import { UpdateItemHandler } from './commands/handlers/update-item.handler';
 

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    CqrsModule,
  ],
  controllers: [CartController],
  providers: [
    CartRepository,
    ProductRepository,
    AddItemHandler,
    GetCartHandler,
    ClearCartHandler,
    RemoveItemHandler,
    UpdateItemHandler,
  ],
  exports: [ProductRepository], 
})
export class CartModule {}
