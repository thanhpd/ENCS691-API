import { IsPositive } from 'class-validator';

export class BidDto {
  @IsPositive()
  amount: number;
}
