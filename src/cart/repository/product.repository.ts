import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from 'src/schemas/Products.schema';
 
@Injectable()
export class ProductRepository {
  constructor(@InjectModel(Product.name) private readonly productModel: Model<Product>) {}

  async findById(productId: Types.ObjectId): Promise<Product | null> {
    return this.productModel.findById(productId).exec();
  }
}
