import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
  UploadedFiles,
  Param,
  Get,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { AuctionLotService } from 'src/auction-lot/auction-lot.service';
import { AuctionService } from 'src/auction/auction.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('auction')
export class AuctionController {
  constructor(
    private auctionService: AuctionService,
    private auctionLotService: AuctionLotService,
  ) {}

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

  @UseGuards(JwtAuthGuard)
  @Get()
  async listAll() {
    return this.auctionService.listAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':auctionId')
  async getOne(@Param('auctionId') auctionId: string) {
    return this.auctionService.findById(auctionId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':auctionId/lot')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'productImages', maxCount: 5 }]),
  )
  async createLot(
    @Param('auctionId') auctionId: string,
    @UploadedFiles() files: { productImages: Express.Multer.File[] },
    @Body() body,
    @Request() req: any,
  ) {
    const { userId } = req.user;

    return this.auctionLotService.create(
      {
        ...body,
        productImages: files.productImages,
      },
      userId,
      auctionId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':auctionId/lot')
  async listLots(@Param('auctionId') auctionId: string) {
    return this.auctionLotService.listAllByAuctionId(auctionId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':auctionId/lot/:lotId')
  async getLot(@Param('lotId') lotId: string) {
    return this.auctionLotService.findById(lotId);
  }
}
