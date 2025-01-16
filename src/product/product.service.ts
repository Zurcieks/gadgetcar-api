import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Categories, Product } from 'src/schemas/Products.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<Product>
    ) {}

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const createdProduct = await new this.productModel(createProductDto);
        return createdProduct.save();    
    }

    async findAll(): Promise<Product[]> {
        return await this.productModel.find().exec();
    }

    async findOne(id: string): Promise<Product> {
        return await this.productModel.findById(id).exec();
    }

    async findByCategorie(categorie: Categories): Promise<Product[]> {
        return await this.productModel.find({ category: categorie }).exec();
    }

    async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
        return await this.productModel.findByIdAndUpdate(id, updateProductDto, {
            new: true,
        }).exec();
    }

    async remove(id: string): Promise<any> {
        const product = await this.productModel.findById(id);
      
        if (!product) {
          throw new NotFoundException(`Product with ID "${id}" not found`);
        }
      
 
        if (product.images && product.images.length > 0) {
          product.images.forEach((imagePath: string) => {
            const fullPath = path.join(__dirname, '..', '..', imagePath); 
            if (fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath); // Usuwanie pliku
            }
          });
        }
      
 
        return await this.productModel.findByIdAndDelete(id);
      }
}
