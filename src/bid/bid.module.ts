import { Module } from '@nestjs/common';
import { BidController } from './bid.controller';
import { BidService } from './bid.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from 'src/bid/bid.entity';
import { User } from 'src/user/user.entity';
import { AuctionLot } from 'src/auction-lot/auction-lot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bid, User, AuctionLot])],
  controllers: [BidController],
  providers: [BidService],
  exports: [BidService, TypeOrmModule],
})
export class BidModule {}
