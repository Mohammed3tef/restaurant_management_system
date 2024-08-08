import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Query,
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './order.schema';
import { Types } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetDailyReportDto } from './dto/get-daily-report.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.createOrder(createOrderDto);
  }

  @Put(':id')
  async updateOrder(
    @Param('id') id: string,
    @Body() orderData: Partial<Order>,
  ): Promise<Order> {
    return this.orderService.updateOrder(id, orderData);
  }

  @Get('/daily-report')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getDailySalesReport(@Query() query: GetDailyReportDto) {
    const { date } = query;

    const reportDate = new Date(date);
    if (isNaN(reportDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    return this.orderService.getDailySalesReport(query);
  }
  @Get(':id')
  async getOrder(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid order ID');
    }
    return this.orderService.getOrderById(id);
  }

  @Get()
  async getAllOrders(): Promise<Order[]> {
    return this.orderService.getAllOrders();
  }
}
