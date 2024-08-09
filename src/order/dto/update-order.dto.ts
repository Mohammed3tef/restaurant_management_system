// src/order/dto/update-order.dto.ts
import { IsMongoId, IsOptional, IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductOrderDto } from './create-order.dto';

export class UpdateOrderDto {
  @IsMongoId()
  @IsOptional()
  customer?: string;

  @Type(() => ProductOrderDto)
  @IsOptional()
  products?: ProductOrderDto[];

  @IsNumber()
  @IsOptional()
  totalPrice?: number;

  @IsDate()
  @IsOptional()
  timestamp?: Date;
}
