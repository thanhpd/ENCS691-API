import {
  Controller,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuctionLotService } from 'src/auction-lot/auction-lot.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BidService } from 'src/bid/bid.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UserService,
    private readonly bidService: BidService,
    private readonly auctionLotService: AuctionLotService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: any) {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    const { userId } = req.user;
    const user: User = await this.usersService.findOne(userId);

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('bids')
  async getBids(@Request() req: any) {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    const { userId } = req.user;
    const bids = await this.bidService.getBidsForUser(userId);

    return bids;
  }

  @UseGuards(JwtAuthGuard)
  @Get('deregister')
  async deregister(@Request() req: any) {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    const { userId } = req.user;
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // Find the auction lots created by the user
    const auctionLots =
      await this.auctionLotService.getAuctionLotsByUserId(userId);

    // Find the bids created by the user
    const bids = await this.bidService.getBidsForUser(userId);

    if (auctionLots.length > 0 || bids.length > 0) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `You cannot deregister because you have active ${auctionLots.length} auction lots and ${bids.length} bids`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.usersService.deregister(user);
  }
}
