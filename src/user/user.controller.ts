import {
  Controller,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BidService } from 'src/bid/bid.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UserService,
    private readonly bidService: BidService,
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
}
