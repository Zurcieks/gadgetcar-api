export class MergeCartsCommand {
    constructor(
      public readonly anonymousUserId: string,
      public readonly loggedInUserId: string,
    ) {}
  }