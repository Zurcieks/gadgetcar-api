import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCartQuery } from '../get-cart.query';
import { CartRepository } from '../../repository/cart.repository';
import { ProductRepository } from 'src/cart/repository/product.repository';

@QueryHandler(GetCartQuery)
export class GetCartHandler implements IQueryHandler<GetCartQuery> {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(query: GetCartQuery) {
    const cart = await this.cartRepository.findByUserId(query.userId);

    if (!cart) {
      return { items: [] };
    }

    const itemsWithProductDetails = await Promise.all(
      cart.items.map(async (item) => {
        const product = await this.productRepository.findById(item.productId);
        
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          name: product?.name || 'Unknown',
          images: product?.images || [],
        };
      }),
    );

    return {
      _id: cart._id,
      userId: cart.userId,
      items: itemsWithProductDetails,
      totalPrice: cart.totalPrice,

    };
  }
}
