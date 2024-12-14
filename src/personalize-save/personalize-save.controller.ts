import {
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PersonalizeSaveService } from 'src/personalize-save/personalize-save.service';

@Controller('personalize-save')
export class PersonalizeSaveController {
  constructor(private personalizeSaveService: PersonalizeSaveService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':auctionLotId')
  async saveItem(
    @Param('auctionLotId') auctionLotId: string,
    @Request() req: any,
  ) {
    const { userId } = req.user;

    if (!req.user) {
      throw new UnauthorizedException();
    }

    this.personalizeSaveService.saveItem(auctionLotId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':auctionLotId')
  async unsaveItem(
    @Param('auctionLotId') auctionLotId: string,
    @Request() req: any,
  ) {
    const { userId } = req.user;

    if (!req.user) {
      throw new UnauthorizedException();
    }

    this.personalizeSaveService.unsaveItem(auctionLotId, userId);
  }
}
