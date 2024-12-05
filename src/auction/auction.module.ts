import { Module } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuctionController } from './auction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction } from 'src/auction/auction.entity';
import { MediaModule } from 'src/common/media/media.module';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auction, User]), MediaModule],
  providers: [AuctionService],
  controllers: [AuctionController],
  exports: [AuctionService, TypeOrmModule],
})
export class AuctionModule {}
