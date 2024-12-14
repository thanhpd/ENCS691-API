import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuctionLot } from 'src/auction-lot/auction-lot.entity';
import { PersonalizeSave } from 'src/personalize-save/personalize-save.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PersonalizeSaveService {
  constructor(
    @InjectRepository(PersonalizeSave)
    private readonly personalizeSaveRepository: Repository<PersonalizeSave>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AuctionLot)
    private readonly auctionLotRepository: Repository<AuctionLot>,
  ) {}

  async saveItem(auctionLotId: string, userId: string) {
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

    const savedItem = await this.personalizeSaveRepository.create({
      auctionLot,
      user,
    });

    return await this.personalizeSaveRepository.save(savedItem);
  }

  async unsaveItem(auctionLotId: string, userId: string) {
    // Remove item from user's saved items
    return await this.personalizeSaveRepository.delete({
      auctionLot: { id: auctionLotId },
      user: { id: userId },
    });
  }
}
