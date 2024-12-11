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
import { CreateAuctionLotDto } from 'src/auction-lot/dto/create-auction-lot.dto';
import { AuctionService } from 'src/auction/auction.service';
import { CreateAuctionDto } from 'src/auction/dto/create-auction.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BidService } from 'src/bid/bid.service';
import { CreateBidDto } from 'src/bid/dto/create-bid.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auction')
export class AuctionController {
  constructor(
    private auctionService: AuctionService,
    private auctionLotService: AuctionLotService,
    private bidService: BidService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('thumbnailImg'))
  async create(
    @UploadedFile() thumbnailImg: Express.Multer.File,
    @Body() body: CreateAuctionDto,
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

  @Public()
  @Get()
  async listAll() {
    return this.auctionService.listAll();
  }

  @Public()
  @Get('/upcoming')
  async listAllUpcoming() {
    return this.auctionService.listAllActiveAndPending();
  }

  @Public()
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
    @Body() body: CreateAuctionLotDto,
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

  @Public()
  @Get(':auctionId/lot')
  async listLots(@Param('auctionId') auctionId: string) {
    return this.auctionLotService.listAllByAuctionId(auctionId);
  }

  @Public()
  @Get(':auctionId/lot/:lotId')
  async getLot(@Param('lotId') lotId: string) {
    return this.auctionLotService.findById(lotId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':auctionId/lot/:lotId/bid')
  async createBid(
    @Param('auctionId') auctionId: string,
    @Param('lotId') lotId: string,
    @Body() body: CreateBidDto,
    @Request() req: any,
  ) {
    const { userId } = req.user;

    return this.bidService.create(body, userId, lotId);
  }
}
