import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { UpdateItemCommand } from '../update-item.command';
import { CartRepository } from 'src/cart/repository/cart.repository';
import { ItemUpdatedEvent } from 'src/cart/events/item-updated.event';
 
@CommandHandler(UpdateItemCommand)
export class UpdateItemHandler implements ICommandHandler<UpdateItemCommand> {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateItemCommand) {
    const { userId, productId, quantity } = command;

    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      throw new Error('Koszyk nie istnieje');
    }

    const item = cart.items.find((item) => item.productId.equals(productId));
    if (!item) {
      throw new Error('Produkt nie istnieje w koszyku');
    }

    item.quantity = quantity;
    await this.cartRepository.save(cart);

    this.eventBus.publish(new ItemUpdatedEvent(userId.toHexString(), productId.toHexString(), quantity));

    return cart;
  }
}
