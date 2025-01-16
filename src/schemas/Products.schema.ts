import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum Categories {
  RADIO = 'radia',
  ACCESSORIES = 'akcesoria',
}

export enum Availability {
  AVAILABLE = 'dostępny',
  NOT_AVAILABLE = 'niedostępny',
}

@Schema()
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: [String], required: false })
  images: string[];

  @Prop({ required: true, enum: Availability })
  availability: Availability;

  @Prop({ required: true })
  stock_quantity: number;

  @Prop({ required: true, enum: Categories })
  category: Categories;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
