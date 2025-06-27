import {
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { UseInterceptors } from '@nestjs/common';
import { Socket } from 'socket.io';

import {
  EventChatRoom,
  EventHeartBeat,
  EventMessage,
} from './enums/chat-event-type.enum';
import { LogUtil } from 'src/config/log/log.util';
import { DtoValidationInterceptor } from './interceptor/dto-valdiation.interceptor';
import { UserValidationInterceptor } from './interceptor/user-valdiation.interceptor';
import { ValidateDto } from 'src/config/decorator/validate-dto.decorator';

import { AuthService } from 'src/domain/auth/auth.service';
import { ChatService } from './servcie/chat.service';
import { EventEmitService } from './servcie/event-emit.service';

import { SendMessageRequestDto } from './dto/send-message.request';
import { EventErrorCode } from './enums/chat-error-code.enum';
@WebSocketGateway()
@UseInterceptors(DtoValidationInterceptor)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly authService: AuthService,
    private readonly chatService: ChatService,
    private readonly eventEmitService: EventEmitService,
    private readonly logUtil: LogUtil,
  ) {}

  async handleConnection(socket: Socket) {
    try {
      // 인증 토큰 검증
      const user = await this.authService.authenticateSocket(socket);
      // 유저 연결 초기화
      await this.chatService.initializeUserConnection(user, socket);
      this.eventEmitService.connectionEstablished(socket, user.id);
    } catch (error) {
      this.logUtil.error(
        `[ChatGateway] handleConnection: ${error} ${socket.id}`,
      );

      // 유저 연결 해제 사전 작업
      await this.chatService.disconnectUserWithDatabaseAndMemory(socket);
      // 연결 실패 이벤트 발송
      this.eventEmitService.connectionFailed(
        socket,
        EventErrorCode.AUTHENTICATION_FAILED,
        `[ChatGateway] handleConnection: ${error} ${socket.id}`,
      );
      // 유저 연결 해제
      socket.disconnect();
    }
  }

  async handleDisconnect(socket: Socket) {
    // 유저 연결 해제 사전 작업
    await this.chatService.disconnectUserWithDatabaseAndMemory(socket);
    // 연결 해제 이벤트 발송
    this.eventEmitService.disconnected(socket);
    // 유저 연결 해제
    socket.disconnect();
  }

  /**
   * 하트비트 이벤트 처리
   * @Event heartbeat
   * @listener heartbeat_success
   * @listener heartbeat_failed
   */
  @SubscribeMessage(EventHeartBeat.HEARTBEAT)
  @UseInterceptors(UserValidationInterceptor)
  heartbeat(@ConnectedSocket() socket: Socket) {
    try {
      const userId = socket.data.userId;
      this.chatService.updateUserLastActivity(userId);
      this.eventEmitService.heartbeatSuccess(socket, socket.id, userId);
    } catch (error) {
      this.logUtil.error(`[ChatGateway] heartbeat: ${error} ${socket.id}`);
      this.eventEmitService.heartbeatFailed(socket, socket.id);
    }
  }

  /**
   * 채팅방 목록 조회
   * @Event get_chat_rooms
   * @listener get_chat_rooms_success
   * @return chatRooms: ChatRooms[]
   */
  @SubscribeMessage(EventChatRoom.GET_CHAT_ROOMS)
  @UseInterceptors(UserValidationInterceptor)
  async getChatRooms(@ConnectedSocket() socket: Socket) {
    try {
      const userId = socket.data.userId;
      const chatRooms = await this.chatService.getChatRooms(userId);
      this.eventEmitService.getChatRoomsSuccess(socket, chatRooms);
    } catch (error) {
      this.logUtil.error(`[ChatGateway] joinChatRoom: ${error} ${socket.id}`);
    }
  }

  /**
   * 메시지 전송
   * @Event send_message
   * @listener message_sent
   */
  @SubscribeMessage(EventMessage.SEND_MESSAGE)
  @UseInterceptors(UserValidationInterceptor)
  @ValidateDto(SendMessageRequestDto)
  async sendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: SendMessageRequestDto,
  ) {
    // try {
    //   const userId = socket.data.userId as string;
    //   const userRole = socket.data.userRole as UserRole;
    //   const result = await this.chatService.sendMessage(
    //     { userId, userRole },
    //     body,
    //   );
    //   this.eventService.messageSent(socket, result);
    // } catch (error) {
    //   this.logUtil.error(`[ChatGateway] sendMessage: ${error} ${socket.id}`);
    // }
  }
}
