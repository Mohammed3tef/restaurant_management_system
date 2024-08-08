// src/order/dto/get-daily-report.dto.ts
import { IsNotEmpty, IsDateString } from 'class-validator';

export class GetDailyReportDto {
  @IsNotEmpty()
  @IsDateString()
  date: string;
}
