import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from './customer.schema';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async createCustomer(
    @Body() customerData: Partial<Customer>,
  ): Promise<Customer> {
    return this.customerService.createCustomer(customerData);
  }

  @Put(':id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() customerData: Partial<Customer>,
  ): Promise<Customer> {
    return this.customerService.updateCustomer(id, customerData);
  }

  @Get(':id')
  async getCustomerById(@Param('id') id: string): Promise<Customer> {
    return this.customerService.getCustomerById(id);
  }

  @Get()
  async getAllCustomers(): Promise<Customer[]> {
    return this.customerService.getAllCustomers();
  }
}
