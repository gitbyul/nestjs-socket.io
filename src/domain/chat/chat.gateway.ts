import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { LogUtil } from 'src/config/log/log.util';

import { AuthService } from 'src/domain/auth/auth.service';
import { ChatService } from './servcie/chat.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly authService: AuthService,
    private readonly chatService: ChatService,
    private readonly logUtil: LogUtil,
  ) {}
  async handleConnection(socket: Socket) {
    try {
      // 인증 토큰 검증
      const user = await this.authService.authenticateSocket(socket);
      // 유저 연결 초기화
      await this.chatService.initializeUserConnection(user, socket);
    } catch (error) {
      // 연결 실패 시 유저 연결 해제
      await this.chatService.disconnectUser(socket);
      throw error;
    }
  }

  async handleDisconnect(socket: Socket) {
    // 유저 연결 해제
    await this.chatService.disconnectUser(socket);
  }
}
