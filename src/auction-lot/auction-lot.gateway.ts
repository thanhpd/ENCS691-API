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
import { MessageEvent } from 'src/bid/enums/message-event.enum';
import { Bid } from 'src/bid/bid.entity';

@WebSocketGateway({
  namespace: 'lot',
})
export class AuctionLotGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private auctionLotService: AuctionLotService) {}

  async handleConnection(client: Socket) {
    this.auctionLotService.getUserFromSocket(client);
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

  @OnEvent(MessageEvent.OnNewBidCreated)
  async onNewBidCreated(event: Bid) {
    this.server.to(event.auctionLot.id).emit('onNewBidCreated', event);
  }
}
