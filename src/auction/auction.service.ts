import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isBefore, startOfMinute } from 'date-fns';
import { Auction } from 'src/auction/auction.entity';
import { CreateAuctionDto } from 'src/auction/dto/create-auction.dto';
import { MediaService } from 'src/common/media/media.service';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuctionService {
  constructor(
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mediaService: MediaService,
  ) {}

  async create(auction: CreateAuctionDto, userId: string): Promise<Auction> {
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

    const isActive = auction.isActive === 'true';

    if (
      !isActive &&
      auction.startAt &&
      isBefore(new Date(auction.startAt), new Date())
    ) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Auction start date must be in the future',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const startAt = startOfMinute(
      isActive ? new Date() : new Date(auction.startAt),
    );

    const newAuction = this.auctionRepository.create({
      name: auction.name,
      details: auction.details,
      type: auction.type,
      status: isActive ? 'active' : 'pending',
      startAt,
      createdAt: new Date(),
      creator: user,
    });

    if (auction.thumbnailImg) {
      const thumbnailImgUrl = await this.mediaService.uploadFile(
        auction.thumbnailImg,
        'auctions',
      );
      newAuction.thumbnailUrl = thumbnailImgUrl;
    }

    return this.auctionRepository.save(newAuction);
  }

  async listAll(): Promise<Auction[]> {
    return this.auctionRepository.find({
      order: {
        startAt: 'asc',
      },
    });
  }

  async listAllActiveAndPending(): Promise<Auction[]> {
    return this.auctionRepository.find({
      where: [{ status: 'active' }, { status: 'pending' }],
      order: {
        startAt: 'asc',
      },
      relations: ['creator'],
    });
  }

  async listUpcomingPreviews(): Promise<Auction[]> {
    return this.auctionRepository.find({
      where: [{ status: 'pending' }],
      order: {
        startAt: 'asc',
      },
      relations: ['creator'],
      take: 5,
    });
  }

  async findById(id: string): Promise<Auction> {
    return this.auctionRepository.findOne({
      where: { id },
      relations: ['creator'],
    });
  }

  async getAuctionsByUserId(userId: string): Promise<Auction[]> {
    return this.auctionRepository.find({
      where: { creator: { id: userId } },
      order: {
        startAt: 'asc',
      },
      relations: ['creator'],
    });
  }
}
