import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order } from './order.schema';
import { Customer } from '../customer/customer.schema';
import { Product } from '../product/product.schema';
import { CreateOrderDto, ProductOrderDto } from './dto/create-order.dto';
import { GetDailyReportDto } from './dto/get-daily-report.dto';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly cacheService: CacheService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { customer, products } = createOrderDto;

    // Validate the customer ID format
    if (!Types.ObjectId.isValid(customer)) {
      throw new BadRequestException('Invalid customer ID format');
    }

    // Find the customer
    const customerExists = await this.customerModel.findById(customer);
    if (!customerExists) {
      throw new NotFoundException('Customer not found');
    }

    // Validate each product ID and fetch the products
    const productIds = products.map((p: ProductOrderDto) => {
      if (!Types.ObjectId.isValid(p.product)) {
        throw new BadRequestException(
          `Invalid product ID format: ${p.product}`,
        );
      }
      return new Types.ObjectId(p.product);
    });

    const fetchedProducts = await this.productModel.find({
      _id: { $in: productIds },
    });
    if (fetchedProducts.length !== productIds.length) {
      throw new NotFoundException('One or more products not found');
    }

    // Calculate the total price
    const totalPrice = fetchedProducts.reduce(
      (sum, product) => sum + product.price,
      0,
    );

    // Create and save the order
    const createdOrder = new this.orderModel({
      ...createOrderDto,
      customer: new Types.ObjectId(customer),
      products: productIds.map((id) => ({ product: id })),
      totalPrice,
    });
    const formattedDate = new Date().toISOString().split('T')[0];
    const cacheKey = `daily-report:${formattedDate}`;
    await this.cacheService.del(cacheKey);

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

    const formattedDate = new Date().toISOString().split('T')[0];
    const cacheKey = `daily-report:${formattedDate}`;
    await this.cacheService.del(cacheKey);

    return this.orderModel
      .findByIdAndUpdate(id, orderData, { new: true })
      .populate('customer')
      .populate('products')
      .exec();
  }
  async getOrderById(id: string): Promise<Order> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid order ID');
    }
    return this.orderModel
      .findById(id)
      .populate('customer')
      .populate({
        path: 'products.product',
        select: 'name price',
      })
      .exec();
  }

  async getAllOrders(): Promise<any> {
    const orders = await this.orderModel.aggregate([
      // Join with the Customer collection
      {
        $lookup: {
          from: 'customers', // Collection name in MongoDB
          localField: 'customer',
          foreignField: '_id',
          as: 'customer',
        },
      },
      { $unwind: '$customer' }, // Deconstruct the customer array

      // Unwind the products array to handle each product individually
      { $unwind: '$products' },

      // Join with the Product collection for each product
      {
        $lookup: {
          from: 'products', // Collection name in MongoDB
          localField: 'products.product',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      { $unwind: '$productDetails' }, // Deconstruct the productDetails array

      // Group the orders back together, including detailed product information
      {
        $group: {
          _id: '$_id',
          customer: { $first: '$customer' },
          products: {
            $push: {
              product_id: '$productDetails._id',
              name: '$productDetails.name',
              price: '$productDetails.price',
            },
          },
          totalPrice: { $first: '$totalPrice' },
          timestamp: { $first: '$timestamp' },
        },
      },

      // Project the final fields
      {
        $project: {
          _id: 0,
          customer: {
            _id: '$customer._id',
            name: '$customer.name',
            email: '$customer.email',
            phone: '$customer.phone',
          },
          products: 1,
          totalPrice: 1,
          timestamp: 1,
        },
      },
    ]);

    return orders;
  }

  // Method to get daily sales report
  async getDailySalesReport(dto: GetDailyReportDto) {
    const { date } = dto;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    if (isNaN(startOfDay.getTime()) || startOfDay > new Date()) {
      throw new BadRequestException('Invalid or future date');
    }

    const cacheKey = `daily-report:${date}`;
    const cachedReport = await this.cacheService.get(cacheKey);
    console.log(cachedReport);
    if (cachedReport) {
      return cachedReport;
    }

    const report = await this.orderModel.aggregate([
      {
        $match: {
          timestamp: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
      },
      {
        $unwind: '$products',
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          numberOfOrders: { $sum: 1 },
          productCounts: {
            $push: {
              product: '$products.product',
              count: { $sum: 1 },
            },
          },
        },
      },
      {
        $unwind: '$productCounts',
      },
      {
        $group: {
          _id: '$productCounts.product',
          totalRevenue: { $first: '$totalRevenue' },
          numberOfOrders: { $first: '$numberOfOrders' },
          count: { $sum: '$productCounts.count' },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $unwind: '$productDetails',
      },
      {
        $limit: 5,
      },
      {
        $project: {
          _id: 0,
          product_id: '$productDetails._id',
          name: '$productDetails.name',
          price: '$productDetails.price',
          count: 1,
          totalRevenue: 1,
          numberOfOrders: 1,
        },
      },
    ]);

    if (!report || report.length === 0) {
      throw new NotFoundException('No sales data found for the given date');
    }

    const { totalRevenue, numberOfOrders } = report[0];

    const result = {
      totalRevenue,
      numberOfOrders,
      topSellingItems: report.map(({ product_id, name, price, count }) => ({
        product_id,
        name,
        price,
        count,
      })),
    };

    await this.cacheService.set(cacheKey, result);

    return result;
  }
}
