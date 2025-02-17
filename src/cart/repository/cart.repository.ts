import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from 'src/schemas/Cart.schema';
 

@Injectable()
export class CartRepository {
  constructor(@InjectModel(Cart.name) private readonly cartModel: Model<Cart>) {}

  async findByUserId(userId: Types.ObjectId): Promise<Cart | null> {
    return this.cartModel.findOne({ userId }).exec();
  }

  async createCart(userId: Types.ObjectId): Promise<Cart> {
    return this.cartModel.create({ userId, items: [], totalPrice: 0 });
  }

  async save(cart: Cart): Promise<Cart> {
    cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);
    return cart.save();
  }
}
