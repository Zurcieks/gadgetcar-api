import { Transform } from 'class-transformer';
import {
  IsDate,
  IsOptional,
  IsPhoneNumber,
  IsPostalCode,
  IsString,
  IsEnum,
} from 'class-validator';
import { Voivodeship } from 'src/schemas/User.schema';

export class updateUserDto {
  @Transform(({ value }) => new Date(value)) // Konwersja stringa na Date
  @IsDate({ message: 'dateOfBirth must be a valid Date instance' })
  dateOfBirth: Date;

  @IsOptional()
  @IsPhoneNumber('PL')
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsPostalCode('PL')
  postalCode?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsEnum(Voivodeship)
  voivodeship?: Voivodeship;
}
