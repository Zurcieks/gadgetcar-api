import { ICommand } from '@nestjs/cqrs';
import { Types } from 'mongoose';

export class RemoveItemCommand implements ICommand {
  constructor(
    public readonly userId: Types.ObjectId,
    public readonly productId: Types.ObjectId,
  ) {}
}
