import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from 'src/common/config.module';
import { HealthModule } from './health/health.module';
import { UsersService } from './users/users.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule,
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'postgres',
    //   password: 'root',
    //   database: 'auction',
    //   entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
    //   migrations: [`${__dirname}/../migrations/*{.ts,.js}`],
    //   synchronize: false,
    //   migrationsRun: true,
    //   logging: true,
    // }),
    EventEmitterModule.forRoot(),
    HealthModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, UsersService],
})
export class AppModule {}
