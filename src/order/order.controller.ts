import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './order.schema';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() orderData: Partial<Order>): Promise<Order> {
    return this.orderService.createOrder(orderData);
  }

  @Put(':id')
  async updateOrder(
    @Param('id') id: string,
    @Body() orderData: Partial<Order>,
  ): Promise<Order> {
    return this.orderService.updateOrder(id, orderData);
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string): Promise<Order> {
    return this.orderService.getOrderById(id);
  }

  @Get()
  async getAllOrders(): Promise<Order[]> {
    return this.orderService.getAllOrders();
  }
}
