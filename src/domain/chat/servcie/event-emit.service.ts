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

@Injectable()
export class EventEmitService {
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
    socket.emit(EventConnection.DISCONNECTED, {});
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
  userNotFound(
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
      timestamp: new Date(),
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
      timestamp: new Date(),
    };
    this.emitSuccess(socket, EventChatRoom.GET_CHAT_ROOMS_SUCCESS, response);
  }

  /**
   * 메시지 전송 실패 이벤트 발송
   * @param socket - 소켓 인스턴스
   * @param socketId - 소켓 ID
   * @param error - 에러
   */
  messageFailed(socket: Socket, errorCode: EventErrorCode, error: Error) {
    this.emitFailed(
      socket,
      EventMessage.MESSAGE_FAILED,
      errorCode,
      error.message,
    );
  }

  /**
   * 메시지 전송 성공 이벤트 발송
   * @param socket - 소켓 인스턴스
   * @param result - 메시지 전송 결과
   */
  messageSent(
    socket: Socket,
    result: {
      chatRoomId: string;
      messageId: string;
      message: string;
      type: ChatMessageType;
      createdAt: Date;
    },
  ) {
    const response: EventPayloadMap[EventMessage.MESSAGE_SENT] = {
      chatRoomId: result.chatRoomId,
      messageId: result.messageId,
      message: result.message,
      type: result.type,
      createdAt: result.createdAt,
    };
    this.emitSuccess(socket, EventMessage.MESSAGE_SENT, response);
    this.emitToRoom(
      socket,
      result.chatRoomId,
      EventMessage.NEW_MESSAGE,
      response,
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
  private emitToRoom(
    socket: Socket,
    roomId: string,
    event: keyof EventPayloadMap,
    data: EventPayloadMap[keyof EventPayloadMap],
  ) {
    const response: IChatEventResponse<keyof EventPayloadMap> = {
      success: true,
      event,
      data,
      timestamp: new Date(),
    };

    socket.to(roomId).emit(event, response);
  }
}
