import { Module } from '@nestjs/common';
import { AuctionLotController } from './auction-lot.controller';
import { AuctionLotService } from './auction-lot.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionLot } from 'src/auction-lot/auction-lot.entity';
import { MediaModule } from 'src/common/media/media.module';

@Module({
  imports: [TypeOrmModule.forFeature([AuctionLot]), MediaModule],
  controllers: [AuctionLotController],
  providers: [AuctionLotService],
  exports: [AuctionLotService, TypeOrmModule],
})
export class AuctionLotModule {}
