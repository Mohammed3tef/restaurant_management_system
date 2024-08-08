import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const createdProduct = new this.productModel(productData);
    return createdProduct.save();
  }

  async updateProduct(
    id: string,
    productData: Partial<Product>,
  ): Promise<Product> {
    return this.productModel.findByIdAndUpdate(id, productData, { new: true });
  }

  async getProductById(id: string): Promise<Product> {
    return this.productModel.findById(id).exec();
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productModel.find().exec();
  }
}
