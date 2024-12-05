import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuctionLot } from 'src/auction-lot/auction-lot.entity';
import { Bid } from 'src/bid/bid.entity';
import { BidDto } from 'src/bid/dto/bid.dto';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BidService {
  constructor(
    @InjectRepository(Bid)
    private readonly bidRepository: Repository<Bid>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AuctionLot)
    private readonly auctionLotRepository: Repository<AuctionLot>,
  ) {}

  async create(bid: BidDto, userId: string, auctionId: string): Promise<Bid> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const auctionLot = await this.auctionLotRepository.findOne({
      where: { id: auctionId },
    });

    if (!auctionLot) {
      throw new Error('Auction lot not found');
    }

    const newBid = await this.bidRepository.create({
      amount: bid.amount,
      createdAt: new Date(),
      bidder: user,
      auctionLot,
    });

    return newBid;
  }
}
