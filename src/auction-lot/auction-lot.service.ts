import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuctionLot } from 'src/auction-lot/auction-lot.entity';
import { CreateAuctionLotDto } from 'src/auction-lot/dto/create-auction-lot.dto';
import { Auction } from 'src/auction/auction.entity';
import { MediaService } from 'src/common/media/media.service';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuctionLotService {
  constructor(
    @InjectRepository(AuctionLot)
    private readonly auctionLotRepository: Repository<AuctionLot>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>,
    private readonly mediaService: MediaService,
  ) {}

  async create(
    auctionLot: CreateAuctionLotDto,
    userId: string,
    auctionId: string,
  ): Promise<AuctionLot> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const auction = await this.auctionRepository.findOne({
      where: { id: auctionId },
    });

    if (!auction) {
      throw new Error('Auction not found');
    }

    let newAuctionLot = await this.auctionLotRepository.create({
      productName: auctionLot.productName,
      itemOverview: auctionLot.itemOverview,
      status: 'pending',
      paymentShippingDetails: auctionLot.paymentShippingDetails,
      terms: auctionLot.terms,
      estPriceLine: auctionLot.estPriceLine,
      startingPrice: auctionLot.startingPrice,
      createdAt: new Date(),
      creator: user,
      auction,
    });

    if (auctionLot.productImages) {
      newAuctionLot.imageUrls = await Promise.all(
        auctionLot.productImages.map(async (image) => {
          return await this.mediaService.uploadFile(image, 'auction-lots');
        }),
      );
    }
    newAuctionLot = await this.auctionLotRepository.save(newAuctionLot);
    delete newAuctionLot.auction;

    return newAuctionLot;
  }

  async listAllByAuctionId(auctionId: string): Promise<AuctionLot[]> {
    console.log(auctionId);
    return this.auctionLotRepository.find({
      where: { auction: { id: auctionId } },
    });
  }

  async findById(id: string): Promise<AuctionLot> {
    return this.auctionLotRepository.findOne({
      where: { id },
    });
  }
}
