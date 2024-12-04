import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bid } from 'src/bid/bid.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BidService {
  constructor(
    @InjectRepository(Bid)
    private readonly bidRepository: Repository<Bid>,
  ) {}

  async create(bid: Bid): Promise<Bid> {
    return this.bidRepository.save(bid);
  }
}
