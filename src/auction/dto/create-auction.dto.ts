import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { AuctionType } from 'src/auction/enums/auction-type.enum';
import { IsImage } from 'src/common/decorators/validators/is-image.decorator';

export class CreateAuctionDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsImage()
  thumbnailImg?: Express.Multer.File;

  @IsDateString()
  startAt: string;

  @IsOptional()
  @IsString()
  details?: string;

  @IsEnum(AuctionType)
  type: AuctionType;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
