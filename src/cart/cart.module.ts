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
 

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: Product.name, schema: ProductSchema }, // <--- DODANE
    ]),
    CqrsModule,
  ],
  controllers: [CartController],
  providers: [
    CartRepository,
    ProductRepository,
    AddItemHandler,
    GetCartHandler,
  ],
  exports: [ProductRepository], // <--- EKSPORTUJEMY, JEŚLI INNE MODUŁY TEŻ MAJĄ GO UŻYWAĆ
})
export class CartModule {}
