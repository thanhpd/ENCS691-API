import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { addMinutes, addSeconds, startOfSecond } from 'date-fns';
import { AuctionLot } from 'src/auction-lot/auction-lot.entity';
import { Auction } from 'src/auction/auction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuctionLotScheduler {
  private readonly logger = new Logger(AuctionLotScheduler.name);

  constructor(
    @InjectRepository(AuctionLot)
    private readonly auctionLotRepository: Repository<AuctionLot>,
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>,
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
  async updateEndTimeForExpiringLots() {
    try {
      // Find all auction lots that have isAutoExtendAfterTimerEnds set to true and extend the endAt by intervalInMinutes
      const results = await this.auctionLotRepository
        .createQueryBuilder('auctionLot')
        .leftJoinAndSelect('auctionLot.bids', 'bids')
        .where(`auctionLot.endAt <= :now`, { now: new Date() })
        .andWhere(
          `auctionLot.isAutoExtendAfterTimerEnds = :isAutoExtendAfterTimerEnds`,
          {
            isAutoExtendAfterTimerEnds: true,
          },
        )
        .andWhere(`auctionLot.status = :status`, { status: 'active' })
        .getMany();

      for (const result of results) {
        if (result.bids.length) {
          // Has bid, set status to ended
          result.status = 'ended';
          await this.auctionLotRepository.save(result);

          // If the associated auction has all lots with 'ended' status, set the auction status to 'ended'
          // const auction = await this.auctionRepository.findOne({
          //   where: { id: result.auction.id },
          //   relations: ['lots'],
          // });
          // if (auction?.auctionLots?.every((lot) => lot.status === 'ended')) {
          //   auction.status = 'ended';
          //   await this.auctionRepository.save(auction);
          // }
        } else {
          // No bid, extend the end time
          await this.auctionLotRepository
            .createQueryBuilder('auctionLot')
            .update(AuctionLot)
            .set({
              endAt: startOfSecond(
                addMinutes(result.endAt, result.intervalInMinutes),
              ),
              updatedAt: new Date(),
            })
            .where(`id = :id`, { id: result.id })
            .execute();
        }
      }
      this.logger.log('Updated auction lots end time');
    } catch (error) {
      this.logger.error('Failed to update auction lots end time', error.stack);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async updateStatusForExpiredLots() {
    try {
      // await this.auctionLotRepository
      //   .createQueryBuilder('auctionLot')
      //   .where(`auctionLot.isAutoExtendAfterTimerEnds != true`)
      //   .andWhere(`auctionLot.endAt <= :now`, { now: new Date() })
      //   .andWhere(`auctionLot.status != :status`, { status: 'ended' })
      //   .printSql()
      //   .getMany();

      // Find all auction lots that are passed the end date but the status is not 'ended' yet
      await this.auctionLotRepository
        .createQueryBuilder()
        .update(AuctionLot)
        .set({ status: 'ended', updatedAt: new Date() })
        .where(`isAutoExtendAfterTimerEnds != true`)
        .andWhere(`endAt <= :now`, { now: addSeconds(new Date(), 1) })
        .andWhere(`status != :status`, { status: 'ended' })
        .execute();
      this.logger.log('Updated auction lots status to ended');
    } catch (error) {
      this.logger.error('Failed to update auction lots status', error.stack);
    }
  }
}
