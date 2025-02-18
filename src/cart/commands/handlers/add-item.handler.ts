import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { AddItemCommand } from '../add-item.command';
import { CartRepository } from '../../repository/cart.repository';
 
import { ItemAddedEvent } from '../../events/item-added.event';
import { ProductRepository } from 'src/cart/repository/product.repository';

@CommandHandler(AddItemCommand)
export class AddItemHandler implements ICommandHandler<AddItemCommand> {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository,  
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: AddItemCommand) {
    const { userId, productId, quantity } = command;
    
    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      cart = await this.cartRepository.createCart(userId);
    }

    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('Produkt nie istnieje');
    }

    const item = cart.items.find((item) => item.productId.equals(productId));
    if (item) {
      item.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, price: product.price, });
    }

    await this.cartRepository.save(cart);
    
    this.eventBus.publish(new ItemAddedEvent(userId.toHexString(), productId.toHexString(), quantity));
    
    return cart;
  }
}
