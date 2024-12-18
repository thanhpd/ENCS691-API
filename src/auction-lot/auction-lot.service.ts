import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addMinutes, endOfMinute, isBefore } from 'date-fns';
import { AuctionLot } from 'src/auction-lot/auction-lot.entity';
import { CreateAuctionLotDto } from 'src/auction-lot/dto/create-auction-lot.dto';
import { Auction } from 'src/auction/auction.entity';
import { MediaService } from 'src/common/media/media.service';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { ITokenContent } from 'src/auth/token-content.interface';
import { PersonalizeSave } from 'src/personalize-save/personalize-save.entity';

@Injectable()
export class AuctionLotService {
  constructor(
    @InjectRepository(AuctionLot)
    private readonly auctionLotRepository: Repository<AuctionLot>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>,
    @InjectRepository(PersonalizeSave)
    private readonly personalizeSaveRepository: Repository<PersonalizeSave>,
    private readonly mediaService: MediaService,
    private readonly jwtService: JwtService,
  ) {}

  async create(
    auctionLot: CreateAuctionLotDto,
    userId: string,
    auctionId: string,
  ): Promise<AuctionLot> {
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

    const auction = await this.auctionRepository.findOne({
      where: { id: auctionId },
    });

    if (!auction) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Auction not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (auctionLot.isStartNow == 'false' && !auctionLot.startAt) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Start date is required',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const isStartNow = auctionLot.isStartNow == 'true';
    const startNowTimestamp = auction.startAt;

    if (
      !isStartNow &&
      auction.startAt &&
      isBefore(new Date(auctionLot.startAt), new Date(startNowTimestamp))
    ) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Auction lot start date must be in the future',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const startAt = endOfMinute(
      isStartNow ? new Date() : new Date(auction.startAt),
    );

    let newAuctionLot = await this.auctionLotRepository.create({
      productName: auctionLot.productName,
      itemOverview: auctionLot.itemOverview,
      paymentShippingDetails: auctionLot.paymentShippingDetails,
      terms: auctionLot.terms,
      estPriceLine: auctionLot.estPriceLine,
      startingPrice: auctionLot.startingPrice,
      createdAt: new Date(),
      status: isStartNow ? 'active' : 'pending',
      startAt,
      endAt: addMinutes(startAt, Number(auctionLot.intervalInMinutes) || 5),
      intervalInMinutes: Number(auctionLot.intervalInMinutes) || 5,
      creator: user,
      auction,
      isAutoExtendAfterTimerEnds:
        auctionLot.isAutoExtendAfterTimerEnds == 'true',
    });

    if (auctionLot.productImages) {
      newAuctionLot.imageUrls = await Promise.all(
        auctionLot.productImages.map(async (image) => {
          return await this.mediaService.uploadFile(image, 'auction-lots');
        }),
      );
    }
    newAuctionLot = await this.auctionLotRepository.save(newAuctionLot);
    delete newAuctionLot.auction;

    return newAuctionLot;
  }

  async listAllByAuctionId(
    auctionId: string,
    userId?: string,
  ): Promise<AuctionLot[]> {
    const lots = await this.auctionLotRepository.find({
      where: { auction: { id: auctionId } },
      order: {
        startAt: 'asc',
      },
      relations: ['bids'],
    });

    if (userId) {
      const savedItems = await this.personalizeSaveRepository.find({
        where: { user: { id: userId } },
        relations: ['auctionLot'],
      });

      lots.forEach((lot) => {
        lot.isSaved = savedItems.some((item) => item.auctionLot.id === lot.id);
      });
    }

    return lots;
  }

  async getAuctionLotsByUserId(userId: string): Promise<AuctionLot[]> {
    return this.auctionLotRepository.find({
      where: { creator: { id: userId } },
      order: {
        startAt: 'asc',
      },
      relations: ['auction'],
    });
  }

  async findById(id: string): Promise<AuctionLot> {
    return this.auctionLotRepository.findOne({
      where: { id },
      relations: ['creator', 'auction', 'bids', 'bids.bidder'],
    });
  }

  // async checkAndCloseLot(auctionLotId: string) {
  //   const auctionLot = await this.auctionLotRepository.findOne({
  //     where: { id: auctionLotId },
  //     relations: ['bids'],
  //   });

  //   if (!auctionLot) {
  //     return;
  //   }

  //   if (auctionLot.status === 'active') {
  //     if (isBefore(new Date(), new Date(auctionLot.endAt))) {
  //       return;
  //     }

  //     if (auctionLot.bids.length > 0) {
  //       auctionLot.status = 'sold';
  //     } else {
  //       auctionLot.status = 'not_sold';
  //     }

  //     await this.auctionLotRepository.save(auctionLot);
  //   }
  // }

  async getUserFromSocket(socket: Socket) {
    try {
      let authToken = socket.handshake.headers.authorization;
      authToken = authToken?.split(' ')[1];

      const tokenContent =
        await this.jwtService.verifyAsync<ITokenContent>(authToken);
      const user = await this.userRepository.findOne({
        where: { id: tokenContent.sub },
      });

      if (!user) {
        throw new WsException('Invalid credentials');
      }

      return user;
    } catch (error) {
      console.error(error);
      socket.disconnect();
    }
  }
}
