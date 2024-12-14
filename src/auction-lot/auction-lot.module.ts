import { Module } from '@nestjs/common';
import { AuctionLotController } from './auction-lot.controller';
import { AuctionLotService } from './auction-lot.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionLot } from 'src/auction-lot/auction-lot.entity';
import { MediaModule } from 'src/common/media/media.module';
import { Auction } from 'src/auction/auction.entity';
import { User } from 'src/user/user.entity';
import { AuctionLotGateway } from './auction-lot.gateway';
import { AuctionLotScheduler } from 'src/auction-lot/auction-lot.scheduler';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/auth/config/jwt.config';
import { PersonalizeSave } from 'src/personalize-save/personalize-save.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuctionLot, Auction, User, PersonalizeSave]),
    MediaModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [AuctionLotController],
  providers: [AuctionLotService, AuctionLotGateway, AuctionLotScheduler],
  exports: [AuctionLotService, TypeOrmModule],
})
export class AuctionLotModule {}
