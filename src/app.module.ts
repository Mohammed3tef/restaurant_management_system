import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderModule } from './order/order.module';
import { CustomerModule } from './customer/customer.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://localhost:27017/restaurant_management_system',
    ),
    CustomerModule,
    ProductModule,
  ],
})
export class AppModule {}
