import { Module } from '@nestjs/common';
import { AuctionLotController } from './auction-lot.controller';
import { AuctionLotService } from './auction-lot.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionLot } from 'src/auction-lot/auction-lot.entity';
import { MediaModule } from 'src/common/media/media.module';
import { Auction } from 'src/auction/auction.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuctionLot, Auction, User]), MediaModule],
  controllers: [AuctionLotController],
  providers: [AuctionLotService],
  exports: [AuctionLotService, TypeOrmModule],
})
export class AuctionLotModule {}
