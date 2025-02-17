import { ICommand } from '@nestjs/cqrs';
import { Types } from 'mongoose';

export class UpdateItemCommand implements ICommand {
  constructor(
    public readonly userId: Types.ObjectId,
    public readonly productId: Types.ObjectId,
    public readonly quantity: number,
  ) {}
}
