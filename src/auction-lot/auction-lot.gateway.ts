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

@WebSocketGateway({
  namespace: 'auction-lot-ws',
})
export class AuctionLotGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  async handleConnection() {
    // await this.connectSocketUserAction.execute(this.server, client);
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

  // @OnEvent(MessageEvent.OnMessageCreated)
  // async onMessageCreated(event: OnMessageCreatedEvent) {
  //   await this.onMessageCreatedAction.execute(this.server, event);
  // }
}
