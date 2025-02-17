import { IEvent } from '@nestjs/cqrs';

export class ItemRemovedEvent implements IEvent {
  constructor(
    public readonly userId: string,
    public readonly productId: string,
  ) {}
}
