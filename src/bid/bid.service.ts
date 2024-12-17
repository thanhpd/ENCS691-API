import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { addMinutes, startOfSecond } from 'date-fns';
import { AuctionLot } from 'src/auction-lot/auction-lot.entity';
import { Bid } from 'src/bid/bid.entity';
import { CreateBidDto } from 'src/bid/dto/create-bid.dto';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { MessageEvent } from './enums/message-event.enum';

@Injectable()
export class BidService {
  constructor(
    @InjectRepository(Bid)
    private readonly bidRepository: Repository<Bid>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AuctionLot)
    private readonly auctionLotRepository: Repository<AuctionLot>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    bid: CreateBidDto,
    userId: string,
    auctionLotId: string,
  ): Promise<Bid> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const auctionLot = await this.auctionLotRepository.findOne({
      where: { id: auctionLotId },
    });

    if (!auctionLot) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Auction lot not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const highestBid = await this.bidRepository.findOne({
      where: { auctionLot: { id: auctionLotId }, isHighestBid: true },
    });

    if (highestBid && bid.amount < highestBid.amount) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error:
            'Bid amount must be equal or higher than the current highest bid',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let returningBid: Bid;

    await this.bidRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const isEqualHighestBid = highestBid?.amount === bid.amount;
        if (highestBid && bid.amount > highestBid.amount) {
          highestBid.isHighestBid = false;
          await transactionalEntityManager.save(highestBid);
        }

        const newBid = await this.bidRepository.create({
          amount: bid.amount,
          createdAt: new Date(),
          bidder: user,
          auctionLot,
          isHighestBid: !isEqualHighestBid,
        });

        returningBid = await transactionalEntityManager.save(newBid);

        auctionLot.endAt = startOfSecond(
          addMinutes(new Date(), Number(auctionLot.intervalInMinutes) || 5),
        );
        await transactionalEntityManager.save(auctionLot);
      },
    );

    this.eventEmitter.emit(MessageEvent.OnNewBidCreated, returningBid);
    return returningBid;
  }

  async getBidsForAuctionLot(auctionLotId: string): Promise<Bid[]> {
    return this.bidRepository.find({
      where: { auctionLot: { id: auctionLotId } },
      relations: ['bidder'],
    });
  }

  async getBidsForUser(userId: string): Promise<Bid[]> {
    return this.bidRepository.find({
      where: { bidder: { id: userId } },
      relations: ['auctionLot', 'auctionLot.auction'],
    });
  }
}
