import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './order.schema';
import { Customer } from '../customer/customer.schema';
import { Product } from '../product/product.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Customer.name) private customerModel: Model<Customer>, // Inject CustomerModel
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const customer = await this.customerModel.findById(orderData.customer);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const products = await this.productModel.find({
      _id: { $in: orderData.products },
    });
    if (products.length !== orderData.products.length) {
      throw new NotFoundException('One or more products not found');
    }

    const totalPrice = products.reduce(
      (sum, product) => sum + product.price,
      0,
    );
    const createdOrder = new this.orderModel({ ...orderData, totalPrice });
    return createdOrder.save();
  }

  async updateOrder(id: string, orderData: Partial<Order>): Promise<Order> {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (orderData.customer) {
      const customer = await this.customerModel.findById(orderData.customer);
      if (!customer) {
        throw new NotFoundException('Customer not found');
      }
    }

    if (orderData.products) {
      const products = await this.productModel.find({
        _id: { $in: orderData.products },
      });
      if (products.length !== orderData.products.length) {
        throw new NotFoundException('One or more products not found');
      }
      orderData.totalPrice = products.reduce(
        (sum, product) => sum + product.price,
        0,
      );
    }

    return this.orderModel
      .findByIdAndUpdate(id, orderData, { new: true })
      .populate('customer products');
  }

  async getOrderById(id: string): Promise<Order> {
    return this.orderModel.findById(id).populate('customer products').exec();
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderModel.find().populate('customer products').exec();
  }

  // Existing methods for generating daily reports remain unchanged
}
