import { Module } from '@nestjs/common';
import { PersonalizeSaveService } from './personalize-save.service';
import { PersonalizeSaveController } from './personalize-save.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaModule } from 'src/common/media/media.module';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/auth/config/jwt.config';
import { AuctionLot } from 'src/auction-lot/auction-lot.entity';
import { User } from 'src/user/user.entity';
import { PersonalizeSave } from 'src/personalize-save/personalize-save.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuctionLot, User, PersonalizeSave]),
    MediaModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  providers: [PersonalizeSaveService],
  controllers: [PersonalizeSaveController],
  exports: [PersonalizeSaveService, TypeOrmModule],
})
export class PersonalizeSaveModule {}
