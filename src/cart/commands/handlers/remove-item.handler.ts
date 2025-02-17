import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CartRepository } from '../../repository/cart.repository';
import { RemoveItemCommand } from '../remove-item.command';
import { ItemRemovedEvent } from 'src/cart/events/item-removed.event';

@CommandHandler(RemoveItemCommand)
export class RemoveItemHandler implements ICommandHandler<RemoveItemCommand> {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RemoveItemCommand) {
    const { userId, productId } = command;

    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      throw new Error('Koszyk nie istnieje');
    }

    cart.items = cart.items.filter((item) => !item.productId.equals(productId));
    await this.cartRepository.save(cart);

    this.eventBus.publish(new ItemRemovedEvent(userId.toHexString(), productId.toHexString()));

    return cart;
  }
}