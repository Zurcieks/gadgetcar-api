import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CartRepository } from '../../repository/cart.repository';
 
import { CartClearedEvent } from 'src/cart/events/cart-cleared.event';
import { ClearCartCommand } from '../clear-cart.command';

@CommandHandler(ClearCartCommand)
export class ClearCartHandler implements ICommandHandler<ClearCartCommand> {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: ClearCartCommand) {
    const { userId } = command;

    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      throw new Error('Koszyk nie istnieje');
    }

    cart.items = [];
    await this.cartRepository.save(cart);

    this.eventBus.publish(new CartClearedEvent(userId.toHexString()));

    return cart;
  }
}