import {
  IsNotEmpty,
  IsMongoId,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProductOrderDto {
  @IsMongoId()
  @IsNotEmpty()
  product: string;
}

export class CreateOrderDto {
  @IsMongoId()
  @IsNotEmpty()
  customer: string;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductOrderDto)
  products: ProductOrderDto[];
}
