import { Module } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuctionController } from './auction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction } from 'src/auction/auction.entity';
import { MediaModule } from 'src/common/media/media.module';

@Module({
  imports: [TypeOrmModule.forFeature([Auction]), MediaModule],
  providers: [AuctionService],
  controllers: [AuctionController],
  exports: [AuctionService, TypeOrmModule],
})
export class AuctionModule {}
