export class CartsMergedEvent {
    constructor(
      public readonly anonymousUserId: string,
      public readonly loggedInUserId: string,
    ) {}
  }
  