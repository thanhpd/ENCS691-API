import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from 'src/common/config.module';
import { HealthModule } from './health/health.module';
import { UserService } from './user/user.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigService } from '@nestjs/config';
import { AuctionModule } from './auction/auction.module';
import { AuctionLotModule } from './auction-lot/auction-lot.module';
import { BidModule } from './bid/bid.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    EventEmitterModule.forRoot(),
    HealthModule,
    AuthModule,
    UserModule,
    AuctionModule,
    AuctionLotModule,
    BidModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {}
