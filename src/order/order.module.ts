import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order, OrderSchema } from './order.schema';
import { CustomerModule } from '../customer/customer.module';
import { ProductModule } from '../product/product.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    CustomerModule, // Import CustomerModule
    ProductModule,
    CacheModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
