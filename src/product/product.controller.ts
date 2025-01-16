import { Controller, Get, Post, Body, Param, Delete, Put, UploadedFiles, UseInterceptors, UseGuards, BadRequestException } from '@nestjs/common';
 
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
 
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

import { Multer } from 'multer';
 
import { ProductService } from './product.service';
import { Categories, Product } from 'src/schemas/Products.schema';
import { JwtAuthGuard } from 'src/auth/guards/JwtAuthGuard';
import { AdminGuard } from 'src/auth/guards/roleGuard';
 

@Controller('products')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 5 }, // Maksymalna liczba zdjęć
      ],
      {
        storage: diskStorage({
          destination: './uploads', // Ścieżka do przechowywania zdjęć
          filename: (req, file, callback) => {
            const filename = `${Date.now()}-${file.originalname}`;
            callback(null, filename);
          },
        }),
      },
    ),
  )
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] }, // Poprawka: użycie typu Express.Multer.File[]
  ): Promise<Product> {
    if (files && files.images) {
      createProductDto.images = files.images.map(file => path.join('uploads', file.filename));
    }
    return this.productsService.create(createProductDto);
  }

 
  @Get()
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

 
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Get('category/:category')
  async getProductByCategory(@Param('category') category: string): Promise<Product[]> {
    const categorieEnum = category as Categories;
    if(!Object.values(Categories).includes(categorieEnum))
    {
        throw new BadRequestException(`Niepoprawna kategoria ${category}`);
    }
    return await this.productsService.findByCategorie(categorieEnum)
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor(  //Pozwala na przesyłanie plików w żądaniach http
      [
        { name: 'images', maxCount: 5 },
      ],
      {
        storage: diskStorage({  //Sposób przechowywania plików
          destination: './uploads',
          filename: (req, file, callback) => {
            const filename = `${Date.now()}-${file.originalname}`;   //Określa nazwe plików Data i oryginalna nazwa
            callback(null, filename);
          },
        }),
      },
    ),
  )
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,  //Body przechwytuje dane przeslane w ciele żądania które są mapowane na obiektDto
    @UploadedFiles() files: { images?: Express.Multer.File[] },   // Pytajnik przy image bo image są opcjonalne i nie muszą być dodawane 
  ): Promise<Product> {
    if (files && files.images) {
      updateProductDto.images = files.images.map(file => path.join('uploads', file.filename));
    }
    return this.productsService.update(id, updateProductDto);
  }

  

  
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    return this.productsService.remove(id);
  }
}
