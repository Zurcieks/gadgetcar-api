import { Module } from '@nestjs/common';
import { ProductService } from './product.service';

import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/schemas/Products.schema';
 
import { JwtAuthGuard } from 'src/auth/guards/JwtAuthGuard';
import { JwtModule } from '@nestjs/jwt'; 
import { AuthModule } from 'src/auth/auth.module';
import { ProductController } from './product.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    JwtModule,  
    AuthModule,  
  ],
  providers: [ProductService, JwtAuthGuard],
  controllers: [ProductController],
})
export class ProductModule {}
