import { IsBoolean, IsDateString, IsEnum, IsString } from 'class-validator';
import { AuctionType } from 'src/auction/enums/auction-type.enum';

export class CreateAuctionDto {
  @IsString()
  name: string;

  thumbnailUrl?: string;

  @IsDateString()
  startAt: string;

  @IsString()
  details?: string;

  @IsEnum(AuctionType)
  type: AuctionType;

  @IsBoolean()
  isActive?: boolean;
}
