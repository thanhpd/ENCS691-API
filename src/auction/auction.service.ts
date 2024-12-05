import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auction } from 'src/auction/auction.entity';
import { CreateAuctionDto } from 'src/auction/dto/create-auction.dto';
import { MediaService } from 'src/common/media/media.service';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuctionService {
  constructor(
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mediaService: MediaService,
  ) {}

  async create(auction: CreateAuctionDto, userId: string): Promise<Auction> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const newAuction = this.auctionRepository.create({
      name: auction.name,
      details: auction.details,
      type: auction.type,
      status: 'pending',
      startAt: auction.startAt,
      createdAt: new Date(),
      creator: user,
    });

    if (auction.thumbnailImg) {
      const thumbnailImgUrl = await this.mediaService.uploadFile(
        auction.thumbnailImg,
        'auctions',
      );
      newAuction.thumbnailUrl = thumbnailImgUrl;
    }

    return this.auctionRepository.save(newAuction);
  }
}
