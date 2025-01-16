import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DateExpression, Document } from 'mongoose';

export enum Voivodeship {
  DOLNOSLASKIE = 'Dolnośląskie',
  KUJAWSKO_POMORSKIE = 'Kujawsko-Pomorskie',
  LUBELSKIE = 'Lubelskie',
  LUBUSKIE = 'Lubuskie',
  LODZKIE = 'Łódzkie',
  MALOPOLSKIE = 'Małopolskie',
  MAZOWIECKIE = 'Mazowieckie',
  OPOLSKIE = 'Opolskie',
  PODKARPACKIE = 'Podkarpackie',
  PODLASKIE = 'Podlaskie',
  POMORSKIE = 'Pomorskie',
  SLASKIE = 'Śląskie',
  SWIETOKRZYSKIE = 'Świętokrzyskie',
  WARMINSKO_MAZURSKIE = 'Warmińsko-Mazurskie',
  WIELKOPOLSKIE = 'Wielkopolskie',
  ZACHODNIOPOMORSKIE = 'Zachodniopomorskie',
}
 
@Schema()
export class User extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  phoneNumber: string;

  @Prop({ required: false })
  address: string;

  @Prop({ required: false })
  postalCode: string;

  @Prop({ required: false })
  city: string;

  @Prop({ required: false })
  dateOfBirth: Date;

  @Prop({ type: String, enum: Voivodeship, required: false })
  voivodeship: Voivodeship;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ required: true, default: 'user' })
  role: string;
 
  @Prop({type: String, default: null})
  refreshToken: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  resetPasswordToken?: string;

  @Prop()
  resetPasswordExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
