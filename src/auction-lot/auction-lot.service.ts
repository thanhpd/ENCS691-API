import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuctionLot } from 'src/auction-lot/auction-lot.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuctionLotService {
  constructor(
    @InjectRepository(AuctionLot)
    private readonly auctionLotRepository: Repository<AuctionLot>,
  ) {}

  async create(auctionLot: AuctionLot): Promise<AuctionLot> {
    return this.auctionLotRepository.save(auctionLot);
  }
}
