import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { AuthService } from 'src/domain/auth/auth.service';
import { ChatService } from './servcie/chat.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly authService: AuthService,
    private readonly chatService: ChatService,
  ) {}
  handleConnection(client: Socket, ...args: any[]) {
    throw new Error('Method not implemented.');
  }

  handleDisconnect(client: Socket) {
    throw new Error('Method not implemented.');
  }

  @SubscribeMessage('receiveMessage')
  receiveMessage(
    @MessageBody() payload: { message: string },
    // @ConnectedSocket() socket: Socket,
  ) {
    console.log('receiveMessage : ', payload);
  }

  @SubscribeMessage('sendMessage')
  sendMessage(
    @MessageBody() payload: { message: string },
    @ConnectedSocket() socket: Socket,
  ) {
    console.log('sendMessage : ', payload);
    socket.emit('sendMessage', payload);
  }
}
