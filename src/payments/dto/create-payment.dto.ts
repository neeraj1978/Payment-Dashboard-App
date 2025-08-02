import { IsNumber, IsString, IsNotEmpty, IsIn, IsOptional, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @IsNotEmpty()
  receiver: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['success', 'failed', 'pending'])
  status: string;

  @IsString()
  @IsNotEmpty()
  method: string;
}