// import { UsePipes } from '@nestjs/common';
// import { OnEvent } from '@nestjs/event-emitter';
import {
  // ConnectedSocket,
  // MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  // SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuctionLotService } from 'src/auction-lot/auction-lot.service';
import { Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { MessageEvent as BidMessageEvent } from 'src/bid/enums/message-event.enum';
import { MessageEvent as AuctionMessageEvent } from 'src/auction/enums/message-event.enum';
import { MessageEvent as AuctionLotMessageEvent } from 'src/auction-lot/enums/message-event.enum';
import { Bid } from 'src/bid/bid.entity';

@WebSocketGateway({
  namespace: 'lot',
  cors: {
    origin: [
      /localhost:([0-9])+/,
      ...(process.env.CORS_ALLOWANCE || '').split(','),
    ],
    methods: ['GET', 'POST'],
  },
})
export class AuctionLotGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private auctionLotService: AuctionLotService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleConnection(_client: Socket) {
    // this.auctionLotService.getUserFromSocket(client);
  }

  async handleDisconnect() {
    // await this.disconnectSocketUserAction.execute(this.server, client);
  }

  // @UsePipes(new WsValidationPipe())
  // @SubscribeMessage('sendMessage')
  // async handleSendMessage(
  //   @ConnectedSocket() client: AuthenticatedSocket,
  //   @MessageBody() data: SendMessageDto,
  // ): Promise<CustomResponse> {
  //   return this.sendMessageAction.execute(client, data);
  // }

  @OnEvent(BidMessageEvent.OnNewBidCreated)
  async onNewBidCreated(event: Bid) {
    this.server.emit('onNewBidCreated', event);
  }

  @OnEvent(AuctionMessageEvent.OnScheduledAuctionBecomesActive)
  async onScheduledAuctionBecomesActive(event: boolean) {
    this.server.emit('onScheduledAuctionBecomesActive', event);
  }

  @OnEvent(AuctionLotMessageEvent.OnAuctionLotEnds)
  async onAuctionLotCreated(event: boolean) {
    this.server.emit('onAuctionLotEnds', event);
  }

  @OnEvent(AuctionLotMessageEvent.OnAuctionLotExtended)
  async onAuctionLotUpdated(event: boolean) {
    this.server.emit('onAuctionLotExtended', event);
  }
}
