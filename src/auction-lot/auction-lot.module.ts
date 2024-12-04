import { Module } from '@nestjs/common';
import { AuctionLotController } from './auction-lot.controller';
import { AuctionLotService } from './auction-lot.service';

@Module({
  controllers: [AuctionLotController],
  providers: [AuctionLotService],
})
export class AuctionLotModule {}
