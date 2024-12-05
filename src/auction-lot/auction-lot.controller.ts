import { Controller } from '@nestjs/common';
import { AuctionLotService } from 'src/auction-lot/auction-lot.service';

@Controller('auction-lot')
export class AuctionLotController {
  constructor(private readonly auctionLotService: AuctionLotService) {}
}
