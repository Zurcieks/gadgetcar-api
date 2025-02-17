export class ItemAddedEvent {
    constructor(
      public readonly userId: string,
      public readonly productId: string,
      public readonly quantity: number,
    ) {}
  }
  