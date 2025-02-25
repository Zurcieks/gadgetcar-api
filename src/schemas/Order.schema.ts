import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Voivodeship } from './User.schema';
 

export type OrderDocument = Order & Document;

class ShippingAddress {
  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  postalCode: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true, type: String, enum: Voivodeship })
  voivodeship: Voivodeship;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop([{
    productId: { type: Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }])
  items: {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
  }[];

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ type: ShippingAddress, required: true })
  shippingAddress: ShippingAddress;

  @Prop({
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'],
    default: 'PENDING'
  })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
