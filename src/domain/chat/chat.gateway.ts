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

import { SendMessageRequestDto } from './dto/request/send-message.request';
import { EventErrorCode } from './enums/chat-error-code.enum';
import { UserRole } from '../auth/enums/user-role.enum';
import { UserNotFoundException } from 'src/config/exception/user-not-found.exception';
import { ChatRoomNotFoundException } from 'src/config/exception/chat-room-not-found.exception';
import { ReadMessageRequestDto } from './dto/request/read-message.request';
import { ChatMessageNotFoundException } from 'src/config/exception/chat-message-not-found.exception';
import { ChatRoomMemberReadMessageOrderInvalidException } from 'src/config/exception/chat-room-member-read-message-order-invalid.exception';
import { ChatRoomMemberReadMessageSameIdException } from 'src/config/exception/chat-room-member-read-message-same-id.exception';

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
      this.logUtil.info(
        `[WebSocket][handleConnection][Attempt][${socket.id}][${socket.handshake.address}]`,
      );

      // 인증 토큰 검증
      const user = await this.authService.authenticateSocket(socket);
      // 유저 연결 초기화
      await this.chatService.initializeUserConnection(user, socket);
      this.eventEmitService.connectionEstablished(socket, user.id);

      this.logUtil.info(
        `[WebSocket][handleConnection][Success][${socket.id}][${user.id}][${user.role}]`,
      );
    } catch (error) {
      this.logUtil.error(
        `[WebSocket][handleConnection][Failed][${socket.id}][${socket.handshake.address}][${error.message}]`,
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
    const userId = socket.data?.userId || 'unknown';
    const userRole = socket.data?.userRole || 'unknown';

    this.logUtil.info(
      `[WebSocket][handleDisconnect][${socket.id}][${userId}][${userRole}]`,
    );

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
      this.logUtil.debug(
        `[WebSocket][heartbeat][Success][${socket.id}][${userId}]`,
      );
    } catch (error) {
      this.logUtil.error(
        `[WebSocket][heartbeat][Failed][${socket.id}][${socket.data?.userId || 'unknown'}][${error.message}]`,
      );
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
      this.logUtil.info(
        `[WebSocket][getChatRooms][Success][${socket.id}][${userId}][${chatRooms.length} rooms]`,
      );
    } catch (error) {
      this.logUtil.error(
        `[WebSocket][getChatRooms][Failed][${socket.id}][${socket.data?.userId || 'unknown'}][${error.message}]`,
      );
    }
  }

  /**
   * 메시지 전송
   * @Event send_message
   * @listener send_message_success
   * @listener send_message_failed
   * @listener new_message
   */
  @SubscribeMessage(EventMessage.SEND_MESSAGE)
  @UseInterceptors(UserValidationInterceptor)
  @ValidateDto(SendMessageRequestDto)
  async sendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: SendMessageRequestDto,
  ) {
    try {
      const userInfo = this.getUserInfo(socket);
      const { userId, userRole } = userInfo;
      this.logUtil.info(
        `[WebSocket][sendMessage][Attempt][${socket.id}][${userId}][${userRole}][${body.chatRoomId}]`,
      );

      const messageInfo = await this.chatService.sendTextMessage(
        { userId, userRole },
        body,
      );
      this.eventEmitService.sendMessageSuccess(socket, messageInfo);
      this.eventEmitService.newMessage(socket, userInfo, messageInfo);
      this.logUtil.info(
        `[WebSocket][sendMessage][Success][${socket.id}][${userId}][${userRole}][${body.chatRoomId}][${messageInfo.messageId}]`,
      );
    } catch (error) {
      let errorCode = EventErrorCode.INTERNAL_ERROR;
      switch (error.constructor) {
        case UserNotFoundException:
          errorCode = EventErrorCode.USER_NOT_FOUND;
          break;
        case ChatRoomNotFoundException:
          errorCode = EventErrorCode.CHAT_ROOM_NOT_FOUND;
          break;
      }
      this.eventEmitService.sendMessageFailed(socket, errorCode, error);
      this.logUtil.error(
        `[WebSocket][sendMessage][Failed][${socket.id}][${socket.data?.userId || 'unknown'}][${socket.data?.userRole || 'unknown'}][${body?.chatRoomId || 'unknown'}][${errorCode}][${error.message}]`,
      );
    }
  }

  /**
   * 메시지 읽음 처리
   * @Event read_message
   * @listener read_message_success
   * @listener read_message_failed
   */
  @SubscribeMessage(EventMessage.READ_MESSAGE)
  @UseInterceptors(UserValidationInterceptor)
  @ValidateDto(ReadMessageRequestDto)
  async readMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: ReadMessageRequestDto,
  ) {
    try {
      const userInfo = this.getUserInfo(socket);
      const { userId, userRole } = userInfo;

      const result = await this.chatService.readMessage(userInfo, body);
      this.eventEmitService.readMessageSuccess(socket, result);
      this.logUtil.info(
        `[WebSocket][readMessage][Success][${socket.id}][${userId}][${userRole}][${body.chatRoomId}][${body.messageId}]`,
      );
    } catch (error) {
      let errorCode = EventErrorCode.INTERNAL_ERROR;
      switch (error.constructor) {
        case UserNotFoundException: // 유저 조회 실패
          errorCode = EventErrorCode.USER_NOT_FOUND;
          break;
        case ChatRoomNotFoundException: // 채팅방 조회 실패
          errorCode = EventErrorCode.CHAT_ROOM_NOT_FOUND;
          break;
        case ChatMessageNotFoundException: // 메시지 조회 실패
          errorCode = EventErrorCode.CHAT_MESSAGE_NOT_FOUND;
          break;
        case ChatRoomMemberReadMessageSameIdException: // 입력받은 메세지가 기존 메세지와 동일한 경우 예외 발생
          errorCode = EventErrorCode.CHAT_ROOM_MEMBER_READ_MESSAGE_SAME_ID;
          break;
        case ChatRoomMemberReadMessageOrderInvalidException: // 메시지 읽음 처리 실패 입력받은 메시지가 기존 메시지보다 오래되었거나 같은 경우
          errorCode =
            EventErrorCode.CHAT_ROOM_MEMBER_READ_MESSAGE_ORDER_INVALID;
          break;
      }
      this.eventEmitService.readMessageFailed(socket, errorCode, error);
      this.logUtil.error(
        `[WebSocket][readMessage][Failed][${socket.id}][${socket.data?.userId || 'unknown'}][${socket.data?.userRole || 'unknown'}][${body?.chatRoomId || 'unknown'}][${error.message}]`,
      );
    }
  }

  private getUserInfo(socket: Socket) {
    return {
      userId: socket.data.userId as string,
      userRole: socket.data.userRole as UserRole,
    };
  }
}
