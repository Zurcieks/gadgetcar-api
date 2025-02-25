import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from 'src/schemas/Cart.schema';

@Injectable()
export class CartRepository {
  constructor(@InjectModel(Cart.name) private readonly cartModel: Model<Cart>) {}

  private getUserId(userId: string | Types.ObjectId): string {
    return typeof userId === 'string' && userId.startsWith('anonymous') 
      ? 'anonymous' 
      : userId.toString();
  }

  private calculateTotalPrice(items: Cart['items']): number {
    return items.reduce((total, item) => total + item.quantity * item.price, 0);
  }

  async findByUserId(userId: string | Types.ObjectId | null): Promise<Cart | null> {
    if (!userId) return null;
    return this.cartModel.findOne({ userId: this.getUserId(userId) }).exec();
  }

  async createCart(userId: string | Types.ObjectId): Promise<Cart> {
    const isAnonymous = typeof userId === 'string' && userId.startsWith('anonymous');
    return this.cartModel.create({
      userId: this.getUserId(userId),
      items: [],
      totalPrice: 0,
      isAnonymous,
    });
  }

  async save(cart: Cart): Promise<Cart> {
    cart.totalPrice = this.calculateTotalPrice(cart.items);
    return cart.save();
  }

  async getCart(userId: string | Types.ObjectId): Promise<Cart | null> {
    const cart = await this.findByUserId(userId);
    if (!cart) {
      return this.createCart(userId);
    }
    return cart;
  }

  
  async clearCart(userId: string | Types.ObjectId): Promise<void> {
    const cart = await this.findByUserId(userId);
    if (cart) {
      cart.items = [];
      cart.totalPrice = 0;
      await this.save(cart);
    }
  }
  async mergeAnonymousCart(anonymousUserId: string, loggedInUserId: string): Promise<Cart | null> {
    const [anonymousCart, userCart] = await Promise.all([
      this.findByUserId('anonymous'),
      this.findByUserId(loggedInUserId),
    ]);

    if (!anonymousCart && !userCart) return null;

    const finalCart = userCart || await this.createCart(loggedInUserId);

    if (anonymousCart) {
      finalCart.items = [...finalCart.items, ...anonymousCart.items];
      finalCart.totalPrice = this.calculateTotalPrice(finalCart.items);

      await Promise.all([
        this.save(finalCart),
        this.cartModel.deleteOne({ userId: 'anonymous' })
      ]);
    }

    return finalCart;
  }
}
