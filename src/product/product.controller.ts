import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.schema';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Body() productData: Partial<Product>): Promise<Product> {
    return this.productService.createProduct(productData);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() productData: Partial<Product>,
  ): Promise<Product> {
    return this.productService.updateProduct(id, productData);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<Product> {
    return this.productService.getProductById(id);
  }

  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }
}
