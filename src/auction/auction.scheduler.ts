import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Auction } from 'src/auction/auction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuctionScheduler {
  private readonly logger = new Logger(AuctionScheduler.name);

  constructor(
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async updateStatusForScheduledAuctions() {
    try {
      // Find all auctions that are passed the start date but the status is not 'active' yet
      const updateResult = await this.auctionRepository
        .createQueryBuilder('auction')
        .update(Auction)
        .set({ status: 'active', updatedAt: new Date() })
        .where(`startAt <= :now`, { now: new Date() })
        .andWhere(`status = :status`, { status: 'pending' })
        .execute();

      if (updateResult.affected) {
        this.logger.log(
          `Updated ${updateResult.affected} auctions status to active`,
        );
        // this.eventEmitter.emit(
        //   MessageEvent.OnScheduledAuctionBecomesActive,
        //   true,
        // );
      }
    } catch (error) {
      this.logger.error('Failed to update auctions status', error.stack);
    }
  }
}
