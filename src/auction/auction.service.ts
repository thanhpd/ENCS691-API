import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auction } from 'src/auction/auction.entity';
import { CreateAuctionDto } from 'src/auction/dto/create-auction.dto';
import { Repository } from 'typeorm';

@Injectable()
export class AuctionService {
  constructor(
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>,
  ) {}

  async create(auction: CreateAuctionDto): Promise<Auction> {
    return this.auctionRepository.save(auction);
  }
}
