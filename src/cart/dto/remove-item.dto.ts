import { IsMongoId } from 'class-validator';

export class RemoveItemDto {
  @IsMongoId()
  productId: string;
}
