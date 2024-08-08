import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Customer } from '../customer/customer.schema';
import { Product } from '../product/product.schema';

@Schema()
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({
    type: [{ _id: false, product: { type: Types.ObjectId, ref: 'Product' } }],
    required: true,
  })
  products: { product: Types.ObjectId }[];

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
