import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from './order/order.module';
import { CustomerModule } from './customer/customer.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigModule available globally
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    OrderModule,
    CustomerModule,
    ProductModule,
  ],
})
export class AppModule {}
