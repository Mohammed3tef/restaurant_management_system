import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from './customer.schema';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {}

  async createCustomer(customerData: Partial<Customer>): Promise<Customer> {
    const createdCustomer = new this.customerModel(customerData);
    return createdCustomer.save();
  }

  async updateCustomer(
    id: string,
    customerData: Partial<Customer>,
  ): Promise<Customer> {
    return this.customerModel.findByIdAndUpdate(id, customerData, {
      new: true,
    });
  }

  async getCustomerById(id: string): Promise<Customer> {
    return this.customerModel.findById(id).exec();
  }

  async getAllCustomers(): Promise<Customer[]> {
    return this.customerModel.find().exec();
  }
}
