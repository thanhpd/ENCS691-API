import {
  IsArray,
  IsBooleanString,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAuctionLotDto {
  @IsString()
  productName: string;

  @IsOptional()
  @IsString()
  itemOverview?: string;

  @IsOptional()
  @IsString()
  paymentShippingDetails?: string;

  @IsOptional()
  @IsString()
  terms?: string;

  @IsOptional()
  @IsString()
  estPriceLine?: string;

  @IsNumberString()
  startingPrice: number;

  @IsOptional()
  @IsArray()
  productImages?: Express.Multer.File[];

  @IsBooleanString()
  isStartNow: string;

  @IsOptional()
  @IsString()
  startAt?: string;

  @IsNumberString()
  intervalInMinutes: string;

  @IsOptional()
  @IsBooleanString()
  isAutoExtendAfterTimerEnds?: string;
}
