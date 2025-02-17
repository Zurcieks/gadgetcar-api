import { IEvent } from '@nestjs/cqrs';

export class ItemUpdatedEvent implements IEvent {
  constructor(
    public readonly userId: string,
    public readonly productId: string,
    public readonly quantity: number,
  ) {}
}
