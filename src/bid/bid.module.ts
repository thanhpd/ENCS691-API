import { Module } from '@nestjs/common';
import { BidController } from './bid.controller';
import { BidService } from './bid.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from 'src/bid/bid.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bid])],
  controllers: [BidController],
  providers: [BidService],
  exports: [BidService, TypeOrmModule],
})
export class BidModule {}
