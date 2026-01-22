import { IsNumber, IsEnum, Min } from 'class-validator';
import { TransactionType } from '../../entities/transaction.entity';

export class CreatePaymentDto {
  @IsNumber()
  @Min(1000) // Minimum 1000 UZS (or your currency unit)
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;
}
