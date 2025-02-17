import { IQuery } from '@nestjs/cqrs';
import { Types } from 'mongoose';

export class GetCartQuery implements IQuery {
  constructor(public readonly userId: Types.ObjectId) {}
}
