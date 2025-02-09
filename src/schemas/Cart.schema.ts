import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
 

@Schema()
export class Cart extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({
    type: [
      {
        product: { type: MongooseSchema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
  })
  items: {
    product: { type: Types.ObjectId, ref: 'Product', required: true },
    quantity: number;
  }[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
