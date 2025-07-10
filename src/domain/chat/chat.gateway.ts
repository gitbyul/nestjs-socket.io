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
import { WebSocketUserValidationInterceptor } from '../auth/interceptor/ws-user-valdiation.interceptor';
import { ValidateDto } from 'src/config/decorator/validate-dto.decorator';

import { AuthService } from 'src/domain/auth/auth.service';
import { ChatService } from './servcie/chat.service';
import { SocketEmitService } from './servcie/socket-emit.service';

import { SendMessageRequestDto } from './dto/request/send-message.request';
import { EventErrorCode } from './enums/chat-error-code.enum';
import { UserRole } from '../auth/enums/user-role.enum';
import { UserNotFoundException } from 'src/config/exception/user-not-found.exception';
import { ChatRoomNotFoundException } from 'src/config/exception/chat-room-not-found.exception';
import { ReadMessageRequestDto } from './dto/request/read-message.request';
import { ChatMessageNotFoundException } from 'src/config/exception/chat-message-not-found.exception';
import { ChatRoomMemberReadMessageOrderInvalidException } from 'src/config/exception/chat-room-member-read-message-order-invalid.exception';
import { ChatRoomMemberReadMessageSameIdException } from 'src/config/exception/chat-room-member-read-message-same-id.exception';
import { LogWebSocketInterceptor } from 'src/config/log/log-ws.interceptor';
import { ChatRoomNotAliveException } from 'src/config/exception/chat-room-not-alive.exception';

@WebSocketGateway()
@UseInterceptors(LogWebSocketInterceptor)
@UseInterceptors(DtoValidationInterceptor)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly authService: AuthService,
    private readonly chatService: ChatService,
    private readonly socketEmitService: SocketEmitService,
    private readonly logUtil: LogUtil,
  ) {}

  /**
   * 소켓 연결 이벤트 처리
   * @Event connection_established
   * @listener connection_established 소켓 연결 성공
   * @listener unread_count_summary 읽지 않은 메시지 수 요약
   * @listener connection_failed 소켓 연결 실패
   * @listener disconnected 소켓 연결 해제
   */
  async handleConnection(socket: Socket) {
    try {
      this.logUtil.info(
        `[WebSocket][handleConnection][Attempt][${socket.id}][${socket.handshake.address}]`,
      );

      // 인증 토큰 검증
      const user = await this.authService.authenticateSocket(socket);
      // 유저 연결 초기화
      await this.chatService.initializeUserConnection(user, socket);
      this.socketEmitService.connectionEstablished(socket, user.id);

      // 읽지 않은 메시지 수 요약
      const unreadCountSummary = await this.chatService.unreadCountSummary(
        user.id,
      );
      this.socketEmitService.unreadCountSummarySuccess(
        socket,
        unreadCountSummary,
      );

      // 로그 출력
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
      this.socketEmitService.connectionFailed(
        socket,
        EventErrorCode.AUTHENTICATION_FAILED,
        `[ChatGateway] handleConnection: ${error} ${socket.id}`,
      );
      // 유저 연결 해제
      socket.disconnect();
    }
  }

  /**
   * 소켓 연결 해제 이벤트 처리
   * @Event disconnected
   * @listener disconnected 소켓 연결 해제
   */
  async handleDisconnect(socket: Socket) {
    const userId = socket.data?.userId || 'unknown';
    const userRole = socket.data?.userRole || 'unknown';

    this.logUtil.info(
      `[WebSocket][handleDisconnect][${socket.id}][${userId}][${userRole}]`,
    );

    // 유저 연결 해제 사전 작업
    await this.chatService.disconnectUserWithDatabaseAndMemory(socket);
    // 연결 해제 이벤트 발송
    this.socketEmitService.disconnected(socket);
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
  @UseInterceptors(WebSocketUserValidationInterceptor)
  heartbeat(@ConnectedSocket() socket: Socket) {
    try {
      const userId = socket.data.userId;
      this.chatService.updateUserLastActivity(userId);
      this.socketEmitService.heartbeatSuccess(socket, socket.id, userId);
      this.logUtil.debug(
        `[WebSocket][heartbeat][Success][${socket.id}][${userId}]`,
      );
    } catch (error) {
      this.logUtil.error(
        `[WebSocket][heartbeat][Failed][${socket.id}][${socket.data?.userId || 'unknown'}][${error.message}]`,
      );
      this.socketEmitService.heartbeatFailed(socket, socket.id);
    }
  }

  /**
   * 채팅방 목록 조회
   * @Event get_chat_rooms
   * @listener get_chat_rooms_success
   * @listener get_chat_rooms_failed
   * @return chatRooms: ChatRooms[]
   */
  @SubscribeMessage(EventChatRoom.GET_CHAT_ROOMS)
  @UseInterceptors(WebSocketUserValidationInterceptor)
  async getChatRooms(@ConnectedSocket() socket: Socket) {
    try {
      const userId = socket.data.userId;
      const chatRooms =
        await this.chatService.getChatRoomListWithMember(userId);

      this.socketEmitService.getChatRoomsSuccess(socket, chatRooms);
      this.logUtil.WebSocketSuccess(
        `[${socket.id}][${userId}] ${chatRooms.length} rooms`,
      );
    } catch (error) {
      this.logUtil.WebSocketError(
        `[${socket.id}][${socket.data?.userId || 'unknown'}][${error.message}]`,
      );
      this.socketEmitService.getChatRoomsFailed(
        socket,
        EventErrorCode.INTERNAL_ERROR,
        error,
      );
    }
  }

  /**
   * 메시지 전송
   * @Event send_message
   * @listener send_message_success 메시지 전송 성공
   * @listener send_message_failed 메시지 전송 실패
   * @listener new_message 새 메시지 수신
   * @listener unread_count_updated 읽지 않은 메시지 수 업데이트
   */
  @SubscribeMessage(EventMessage.SEND_MESSAGE)
  @UseInterceptors(WebSocketUserValidationInterceptor)
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

      const { chatRoomId, message, type, createdAt, unreadCountMemberList } =
        await this.chatService.sendTextMessage({ userId, userRole }, body);
      const messageInfo = {
        chatRoomId,
        message,
        type,
        createdAt,
      };

      this.socketEmitService.sendMessageSuccess(socket, messageInfo);
      this.socketEmitService.newMessage(socket, userInfo, messageInfo);
      for (const unreadCountMember of unreadCountMemberList) {
        const { socketId, unreadCount, createdAt } = unreadCountMember;

        if (!socketId) {
          continue;
        }
        this.socketEmitService.unreadCountUpdated(socket, socketId, {
          chatRoomId,
          unreadCount,
          updatedAt: createdAt,
        });
      }

      this.logUtil.info(
        `[WebSocket][sendMessage][Success][${socket.id}][${userId}][${userRole}][${body.chatRoomId}][${messageInfo.message.messageId}]`,
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
        case ChatRoomNotAliveException:
          errorCode = EventErrorCode.CHAT_ROOM_NOT_ALIVE;
          break;
      }
      this.socketEmitService.sendMessageFailed(socket, errorCode, error);
      this.logUtil.error(
        `[WebSocket][sendMessage][Failed][${socket.id}][${socket.data?.userId || 'unknown'}][${socket.data?.userRole || 'unknown'}][${body?.chatRoomId || 'unknown'}][${errorCode}][${error.message}]`,
      );
    }
  }

  /**
   * 메시지 읽음 처리
   * @Event read_message
   * @listener read_message_success 메시지 읽음 처리 성공
   * @listener read_message_failed 메시지 읽음 처리 실패
   */
  @SubscribeMessage(EventMessage.READ_MESSAGE)
  @UseInterceptors(WebSocketUserValidationInterceptor)
  @ValidateDto(ReadMessageRequestDto)
  async readMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: ReadMessageRequestDto,
  ) {
    try {
      const userInfo = this.getUserInfo(socket);
      const { userId, userRole } = userInfo;

      const result = await this.chatService.readMessage(userInfo, body);
      this.socketEmitService.readMessageSuccess(socket, result);
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
      this.socketEmitService.readMessageFailed(socket, errorCode, error);
      this.logUtil.error(
        `[WebSocket][readMessage][Failed][${socket.id}][${socket.data?.userId || 'unknown'}][${socket.data?.userRole || 'unknown'}][${body?.chatRoomId || 'unknown'}][${error.message}]`,
      );
    }
  }

  /**
   * 읽지 않은 메시지 수 요약 조회
   * @Event get_unread_count_summary
   * @listener unread_count_summary 읽지 않은 메시지 수 요약
   */
  @SubscribeMessage(EventMessage.UNREAD_COUNT_SUMMARY)
  @UseInterceptors(WebSocketUserValidationInterceptor)
  async getUnreadCountSummary(@ConnectedSocket() socket: Socket) {
    try {
      const userId = socket.data.userId;
      const unreadCountSummary =
        await this.chatService.unreadCountSummary(userId);
      this.socketEmitService.unreadCountSummarySuccess(
        socket,
        unreadCountSummary,
      );
    } catch (error) {
      let errorCode = EventErrorCode.INTERNAL_ERROR;
      switch (error.constructor) {
        case UserNotFoundException:
          errorCode = EventErrorCode.USER_NOT_FOUND;
          break;
      }
      this.socketEmitService.unreadCountSummaryFailed(socket, errorCode, error);
      this.logUtil.error(
        `[WebSocket][getUnreadCountSummary][Failed][${socket.id}][${socket.data?.userId || 'unknown'}][${error.message}]`,
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
