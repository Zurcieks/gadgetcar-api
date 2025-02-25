import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';

import { ProductService } from './product.service';
import { Categories, Product } from 'src/schemas/Products.schema';
import { JwtAuthGuard } from 'src/auth/guards/JwtAuthGuard';
import { AdminGuard } from 'src/auth/guards/roleGuard';

const uploadDir = path.join(__dirname, '..', '..', 'uploads');

 
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

@Controller('products')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 7}], {
      storage: diskStorage({
        destination: (req, file, callback) => {
          callback(null, uploadDir);
        },
        filename: (req, file, callback) => {
          const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
          callback(null, filename);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },  
    }),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ): Promise<Product> {
    if (!files || !files.images || files.images.length === 0) {
      throw new BadRequestException('Przynajmniej jedno zdjęcie jest wymagane.');
    }

    try {
      createProductDto.images = files.images.map((file) =>
        path.join('uploads', file.filename),
      );
      return this.productsService.create(createProductDto);
    } catch (error) {
      throw new InternalServerErrorException('Błąd zapisu plików.');
    }
  }

  @Get('/')
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Get('category/:category')
  async getProductByCategory(@Param('category') category: string): Promise<Product[]> {
    const categoryEnum = category as Categories;
    if (!Object.values(Categories).includes(categoryEnum)) {
      throw new BadRequestException(`Niepoprawna kategoria: ${category}`);
    }
    return await this.productsService.findByCategorie(categoryEnum);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 5 }], {
      storage: diskStorage({
        destination: (req, file, callback) => {
          callback(null, uploadDir);
        },
        filename: (req, file, callback) => {
          const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
          callback(null, filename);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ): Promise<Product> {
    if (files && files.images) {
      updateProductDto.images = files.images.map((file) =>
        path.join('uploads', file.filename),
      );
    }
    return this.productsService.update(id, updateProductDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    return this.productsService.remove(id);
  }
}
