import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCartQuery } from '../get-cart.query';
import { CartRepository } from '../../repository/cart.repository';

@QueryHandler(GetCartQuery)
export class GetCartHandler implements IQueryHandler<GetCartQuery> {
  constructor(private readonly cartRepository: CartRepository) {}

  async execute(query: GetCartQuery) {
    const cart = await this.cartRepository.findByUserId(query.userId);
    return cart || { items: [] };
  }
}
