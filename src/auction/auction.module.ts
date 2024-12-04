import { Module } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuctionController } from './auction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction } from 'src/auction/auction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auction])],
  providers: [AuctionService],
  controllers: [AuctionController],
  exports: [AuctionService, TypeOrmModule],
})
export class AuctionModule {}
