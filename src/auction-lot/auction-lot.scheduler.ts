import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { AuctionLot } from 'src/auction-lot/auction-lot.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuctionLotScheduler {
  private readonly logger = new Logger(AuctionLotScheduler.name);

  constructor(
    @InjectRepository(AuctionLot)
    private readonly auctionLotRepository: Repository<AuctionLot>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async updateStatusForScheduledLots() {
    try {
      // Find all auction lots that are passed the end date but the status is not 'ended' yet
      await this.auctionLotRepository
        .createQueryBuilder('auctionLot')
        .update(AuctionLot)
        .set({ status: 'active', updatedAt: new Date() })
        .where(`startAt <= :now`, { now: new Date() })
        .andWhere(`status = :status`, { status: 'pending' })
        .execute();
      this.logger.log('Updated auction lots status to active');
    } catch (error) {
      this.logger.error('Failed to update auction lots status', error.stack);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async updateStatusForExpiredLots() {
    try {
      // Find all auction lots that are passed the end date but the status is not 'ended' yet
      await this.auctionLotRepository
        .createQueryBuilder('auctionLot')
        .update(AuctionLot)
        .set({ status: 'ended', updatedAt: new Date() })
        .where(`endAt < :now`, { now: new Date() })
        .andWhere(`status != :status`, { status: 'ended' })
        .execute();
      this.logger.log('Updated auction lots status to ended');
    } catch (error) {
      this.logger.error('Failed to update auction lots status', error.stack);
    }
  }
}