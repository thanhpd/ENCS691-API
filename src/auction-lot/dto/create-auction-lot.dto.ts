import { IsArray, IsPositive, IsString } from 'class-validator';

export class CreateAuctionLotDto {
  @IsString()
  productName: string;

  @IsString()
  itemOverview: string;

  @IsString()
  paymentShippingDetails: string;

  @IsString()
  terms: string;

  @IsString()
  estPriceLine: string;

  @IsPositive()
  startingPrice: number;

  @IsArray()
  productImages: Express.Multer.File[];
}
