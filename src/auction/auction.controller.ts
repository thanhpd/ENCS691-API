import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuctionService } from 'src/auction/auction.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('auction')
export class AuctionController {
  constructor(private auctionService: AuctionService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('thumbnailImg'))
  async create(
    @UploadedFile() thumbnailImg: Express.Multer.File,
    @Body() body,
    @Request() req: any,
  ) {
    const { userId } = req.user;

    return this.auctionService.create(
      {
        ...body,
        thumbnailImg,
      },
      userId,
    );
  }
}
