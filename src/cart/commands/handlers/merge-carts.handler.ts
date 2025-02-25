import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { CartRepository } from 'src/cart/repository/cart.repository';
import { CartsMergedEvent } from 'src/cart/events/carts-merged.event';
import { MergeCartsCommand } from '../merge-cart.command';
 

@CommandHandler(MergeCartsCommand)
export class MergeCartsHandler implements ICommandHandler<MergeCartsCommand> {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: MergeCartsCommand) {
    const { anonymousUserId, loggedInUserId } = command;

    const mergedCart = await this.cartRepository.mergeAnonymousCart(
      anonymousUserId,
      loggedInUserId
    );

    if (mergedCart) {
      this.eventBus.publish(new CartsMergedEvent(anonymousUserId, loggedInUserId));
    }

    return mergedCart;
  }
}


