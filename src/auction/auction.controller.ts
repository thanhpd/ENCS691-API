import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuctionService } from 'src/auction/auction.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MediaService } from 'src/common/media/media.service';

@Controller('auction')
export class AuctionController {
  constructor(
    private auctionService: AuctionService,
    private mediaService: MediaService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const url = await this.mediaService.uploadFile(file, 'auctions');
    return { url };
  }
}
