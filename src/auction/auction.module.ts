import { Module } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuctionController } from './auction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction } from 'src/auction/auction.entity';
import { MediaModule } from 'src/common/media/media.module';
import { User } from 'src/user/user.entity';
import { AuctionLotModule } from 'src/auction-lot/auction-lot.module';
import { BidModule } from 'src/bid/bid.module';
import { Bid } from 'src/bid/bid.entity';
import { AuctionScheduler } from 'src/auction/auction.scheduler';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auction, User, Bid]),
    MediaModule,
    AuctionLotModule,
    BidModule,
  ],
  providers: [AuctionService, AuctionScheduler],
  controllers: [AuctionController],
  exports: [AuctionService, TypeOrmModule],
})
export class AuctionModule {}
