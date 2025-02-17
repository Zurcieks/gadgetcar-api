import { IEvent } from '@nestjs/cqrs';

export class CartClearedEvent implements IEvent {
  constructor(public readonly userId: string) {}
}
