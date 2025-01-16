import { IsString, IsNotEmpty, IsArray, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Availability, Categories } from 'src/schemas/Products.schema';
 

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsEnum(Availability)
  @IsNotEmpty()
  availability: Availability;

  @IsNumber()
  @IsNotEmpty()
  stock_quantity: number;

  @IsEnum(Categories)
  @IsNotEmpty()
  category: Categories;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;
}
