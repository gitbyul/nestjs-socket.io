import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { EventErrorCode } from '../enums/chat-error-code.enum';
import { EventPayloadMap } from '../type/event-payload.map';
import { ConnectionStatus } from '../enums/connection-state.enum';
import { ChatRooms } from '../entity/ChatRooms.entity';
import { ChatMessageType } from '../enums/chat-message-type.enum';
import {
  EventChatRoom,
  EventConnection,
  EventHeartBeat,
  EventMessage,
} from '../enums/chat-event-type.enum';
import { IChatEventResponse } from '../interface/chat-event-response.interface';
import { UserRole } from 'src/domain/auth/enums/user-role.enum';

@Injectable()
export class SocketEmitService {
  /**
   * 연결 성공 이벤트 발송
   * @param socket - 소켓 인스턴스
   * @param userId - 유저 ID
   */
  connectionEstablished(socket: Socket, userId: string) {
    const response: EventPayloadMap[EventConnection.CONNECTION_ESTABLISHED] = {
      userId: userId,
      status: ConnectionStatus.CONNECTED,
      timestamp: new Date(),
    };
    this.emitSuccess(socket, EventConnection.CONNECTION_ESTABLISHED, response);
  }

  /**
   * 연결 실패 이벤트 발송
   * @param socket - 소켓 인스턴스
   * @param errorCode - 에러 코드
   * @param message - 에러 메시지
   */
  connectionFailed(socket: Socket, errorCode: EventErrorCode, message: string) {
    this.emitFailed(
      socket,
      EventConnection.CONNECTION_FAILED,
      errorCode,
      message,
    );
  }

  /**
   * 연결 해제 이벤트 발송
   * @param socket - 소켓 인스턴스
   */
  disconnected(socket: Socket) {
    this.emitSuccess(socket, EventConnection.DISCONNECTED, void 0);
  }

  /**
   * 유효성 검사 실패 이벤트 발송
   * @param socket - 소켓 인스턴스
   * @param errorCode - 에러 코드
   * @param message - 에러 메시지
   */
  validationFailed(
    socket: Socket,
    eventName: keyof EventPayloadMap,
    validationErrors: any,
  ) {
    this.emitFailed(
      socket,
      eventName,
      EventErrorCode.VALIDATION_FAILED,
      JSON.stringify(validationErrors),
    );
  }

  /**
   * 유저 연결 실패 이벤트 발송 (유저 연결 상태 확인 실패)
   * @param socket - 소켓 인스턴스
   * @param eventName - 이벤트 이름
   * @param errorCode - 에러 코드
   * @param message - 에러 메시지
   */
  userValidationFailed(
    socket: Socket,
    eventName: keyof EventPayloadMap,
    message: string,
  ) {
    this.emitFailed(socket, eventName, EventErrorCode.USER_NOT_FOUND, message);
  }

  /**
   * 하트비트 성공 이벤트 발송
   * @param socket - 소켓 인스턴스
   * @param socketId - 소켓 ID
   * @param userId - 유저 ID
   */
  heartbeatSuccess(socket: Socket, socketId: string, userId: string) {
    const response: EventPayloadMap[EventHeartBeat.HEARTBEAT_SUCCESS] = {
      userId: userId,
      socketId: socketId,
    };
    this.emitSuccess(socket, EventHeartBeat.HEARTBEAT_SUCCESS, response);
  }

  /**
   * 하트비트 실패 이벤트 발송
   * @param socket - 소켓 인스턴스
   * @param socketId - 소켓 ID
   */
  heartbeatFailed(socket: Socket, socketId: string) {
    this.emitFailed(
      socket,
      EventHeartBeat.HEARTBEAT_FAILED,
      EventErrorCode.USER_NOT_FOUND,
      `[EventService] heartbeatFailed: userId not found for socketId : ${socketId}`,
    );
  }

  /**
   * 채팅방 목록 조회 성공 이벤트 발송
   * @param socket - 소켓 인스턴스
   * @param chatRooms - 채팅방 목록
   */
  getChatRoomsSuccess(socket: Socket, chatRooms: ChatRooms[]) {
    const response: EventPayloadMap[EventChatRoom.GET_CHAT_ROOMS_SUCCESS] = {
      chatRooms: chatRooms,
    };
    this.emitSuccess(socket, EventChatRoom.GET_CHAT_ROOMS_SUCCESS, response);
  }

  /**
   * 채팅방 목록 조회 실패 이벤트 발송
   * @param socket - 소켓 인스턴스
   * @param errorCode - 에러 코드
   * @param error - 에러
   */
  getChatRoomsFailed(socket: Socket, errorCode: EventErrorCode, error: Error) {
    this.emitFailed(
      socket,
      EventChatRoom.GET_CHAT_ROOMS_FAILED,
      errorCode,
      error.message,
    );
  }

  /**
   * 메시지 전송 성공 이벤트 발송
   * @param socket - 소켓 인스턴스
   * @param result - 메시지 전송 결과
   */
  sendMessageSuccess(
    socket: Socket,
    message: {
      chatRoomId: string;
      message: { messageId: string; message?: string };
      file?: {
        fileId: string;
        originalFilename: string;
        mimetype: string;
        size: number | null;
        path: string;
        url: string;
        orderNumber?: number;
      };
      type: ChatMessageType;
      createdAt: Date;
    },
  ) {
    const response: EventPayloadMap[EventMessage.SEND_MESSAGE_SUCCESS] = {
      chatRoomId: message.chatRoomId,
      message: message.message,
      file: message.file,
      type: message.type,
      createdAt: message.createdAt,
    };

    this.emitSuccess(socket, EventMessage.SEND_MESSAGE_SUCCESS, response);
  }

  /**
   * 메시지 전송 실패 이벤트 발송
   * @param socket - 소켓 인스턴스
   * @param socketId - 소켓 ID
   * @param error - 에러
   */
  sendMessageFailed(socket: Socket, errorCode: EventErrorCode, error: Error) {
    this.emitFailed(
      socket,
      EventMessage.SEND_MESSAGE_FAILED,
      errorCode,
      error.message,
    );
  }

  /**
   * 새 메시지 수신 이벤트 발송
   * @param socket - 소켓 인스턴스
   * @param sender - 메시지 발신자 정보
   * @param message - 메시지 정보
   */
  newMessage(
    socket: Socket,
    sender: {
      userId: string;
      userRole: UserRole;
    },
    message: {
      chatRoomId: string;
      message: { messageId: string; message?: string };
      file?: {
        fileId: string;
        originalFilename: string;
        mimetype: string;
        size: number | null;
        path: string;
        url: string;
        orderNumber?: number;
      };
      type: ChatMessageType;
      createdAt: Date;
    },
  ) {
    const response: EventPayloadMap[EventMessage.NEW_MESSAGE] = {
      senderId: sender.userId,
      senderType: sender.userRole,
      chatRoomId: message.chatRoomId,
      message: message.message,
      file: message.file,
      type: message.type,
      createdAt: message.createdAt,
    };

    this.emitToRoom(
      socket,
      message.chatRoomId,
      EventMessage.NEW_MESSAGE,
      response,
    );
  }

  /**
   * 메시지 읽음 처리 성공 이벤트 발송
   * @param socket - 소켓 인스턴스
   * @param result - 메시지 읽음 처리 결과
   */
  readMessageSuccess(
    socket: Socket,
    result: {
      chatRoomId: string;
      messageId: string;
      readerId: string;
      readerType: UserRole;
      createdAt: Date;
    },
  ) {
    const response: EventPayloadMap[EventMessage.READ_MESSAGE_SUCCESS] = {
      chatRoomId: result.chatRoomId,
      messageId: result.messageId,
      readerId: result.readerId,
      readerType: result.readerType,
      createdAt: result.createdAt,
    };

    this.emitSuccess(socket, EventMessage.READ_MESSAGE_SUCCESS, response);
  }

  /**
   * 메시지 읽음 처리 실패 이벤트 발송
   * @param socket - 소켓 인스턴스
   * @param errorCode - 에러 코드
   * @param error - 에러
   */
  readMessageFailed(socket: Socket, errorCode: EventErrorCode, error: Error) {
    this.emitFailed(
      socket,
      EventMessage.READ_MESSAGE_FAILED,
      errorCode,
      error.message,
    );
  }

  /**
   * 읽지 않은 메시지 수 업데이트 이벤트 발송
   * @param socket - 소켓 인스턴스
   * @param socketId - 소켓 ID
   * @param chatRoomId - 채팅방 ID
   * @param unreadCount - 읽지 않은 메시지 수
   * @param createdAt - 생성 일시
   */
  unreadCountUpdated(
    socket: Socket,
    socketId: string,
    unreadCountMember: {
      chatRoomId: string;
      unreadCount: number;
      updatedAt: Date;
    },
  ) {
    const response: EventPayloadMap[EventMessage.UNREAD_COUNT_UPDATED] = {
      chatRoomId: unreadCountMember.chatRoomId,
      unreadCount: unreadCountMember.unreadCount,
      updatedAt: unreadCountMember.updatedAt,
    };
    this.emitToSocketId(
      socket,
      socketId,
      EventMessage.UNREAD_COUNT_UPDATED,
      response,
    );
  }

  /**
   * 읽지 않은 메시지 수 요약 이벤트 발송
   * @param socket - 소켓 인스턴스
   * @param unreadCountSummary - 읽지 않은 메시지 수 요약
   */
  unreadCountSummary(
    socket: Socket,
    unreadCountSummary: {
      chatRoomId: string;
      unreadCount: number;
      updatedAt: Date | null;
    }[],
  ) {
    const response: EventPayloadMap[EventMessage.UNREAD_COUNT_SUMMARY] = {
      summary: unreadCountSummary,
      totalUnreadCount: unreadCountSummary.reduce(
        (acc, curr) => acc + curr.unreadCount,
        0,
      ),
    };
    this.emitSuccess(socket, EventMessage.UNREAD_COUNT_SUMMARY, response);
  }

  /**
   * 읽지 않은 메시지 수 요약 조회 실패 이벤트 발송
   * @param socket - 소켓 인스턴스
   * @param error - 에러
   */
  unreadCountSummaryFailed(
    socket: Socket,
    errorCode: EventErrorCode,
    error: Error,
  ) {
    this.emitFailed(
      socket,
      EventMessage.UNREAD_COUNT_SUMMARY_FAILED,
      errorCode,
      error.message,
    );
  }

  /**
   * 성공 응답 이벤트 발송
   * @param socket - 소켓 인스턴스
   * @param event - 이벤트 타입
   * @param data - 이벤트 데이터
   */
  private emitSuccess<T extends keyof EventPayloadMap>(
    socket: Socket,
    event: T,
    data: EventPayloadMap[T],
  ) {
    const response: IChatEventResponse<T> = {
      success: true,
      event,
      data,
      timestamp: new Date(),
    };

    socket.emit(event, response);
  }

  /**
   * 실패 응답 이벤트 발송
   * @param socket - 소켓 인스턴스
   * @param event - 이벤트 타입
   * @param code - 오류 코드
   * @param message - 오류 메시지
   */
  private emitFailed(
    socket: Socket,
    event: keyof EventPayloadMap,
    code: EventErrorCode,
    message: string,
  ) {
    const response: IChatEventResponse<keyof EventPayloadMap> = {
      success: false,
      event,
      error: {
        code,
        message,
      },
      timestamp: new Date(),
    };

    socket.emit(event, response);
  }

  /**
   * 방 내부 이벤트 발송
   * @param socket - 소켓 인스턴스
   * @param roomId - 방 ID
   * @param event - 이벤트 타입
   * @param data - 이벤트 데이터
   */
  private emitToRoom<T extends keyof EventPayloadMap>(
    socket: Socket,
    roomId: string,
    event: T,
    data: EventPayloadMap[T],
  ) {
    const response: IChatEventResponse<keyof EventPayloadMap> = {
      success: true,
      event,
      data,
      timestamp: new Date(),
    };

    socket.to(roomId).emit(event, response);
  }

  private emitToSocketId<T extends keyof EventPayloadMap>(
    socket: Socket,
    socketId: string,
    event: T,
    data: EventPayloadMap[T],
  ) {
    socket.to(socketId).emit(event, data);
  }
}
