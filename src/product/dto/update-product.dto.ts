import { IsString, IsOptional, IsArray, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { Availability, Categories } from 'src/schemas/Products.schema';
 

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsEnum(Availability)
  @IsOptional()
  availability?: Availability;

  @IsNumber()
  @IsOptional()
  stock_quantity?: number;

  @IsEnum(Categories)
  @IsOptional()
  category?: Categories;

  @IsDateString()
  @IsOptional()
  createdAt?: Date;

  @IsDateString()
  @IsOptional()
  updatedAt?: Date;
}
