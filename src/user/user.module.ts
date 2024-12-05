import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UsersController } from './user.controller';
import { MediaModule } from 'src/common/media/media.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MediaModule],
  providers: [UserService],
  controllers: [UsersController],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
