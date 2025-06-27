import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

import { EventErrorCode } from '../enums/chat-error-code.enum';
import { EventEmitUtil } from '../util/event-emit.util';
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
    EventEmitUtil.emitSuccess(
      socket,
      EventConnection.CONNECTION_ESTABLISHED,
      response,
    );
  }

  /**
   * 연결 실패 이벤트 발송
   * @param socket - 소켓 인스턴스
   * @param errorCode - 에러 코드
   * @param message - 에러 메시지
   */
  connectionFailed(socket: Socket, errorCode: EventErrorCode, message: string) {
    EventEmitUtil.emitFailed(
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
    EventEmitUtil.emitDisconnected(socket);
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
    EventEmitUtil.emitSuccess(
      socket,
      EventHeartBeat.HEARTBEAT_SUCCESS,
      response,
    );
  }

  /**
   * 하트비트 실패 이벤트 발송
   * @param socket - 소켓 인스턴스
   * @param socketId - 소켓 ID
   */
  heartbeatFailed(socket: Socket, socketId: string) {
    EventEmitUtil.emitFailed(
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
    EventEmitUtil.emitSuccess(
      socket,
      EventChatRoom.GET_CHAT_ROOMS_SUCCESS,
      response,
    );
  }

  /**
   * 메시지 전송 실패 이벤트 발송
   * @param socket - 소켓 인스턴스
   * @param socketId - 소켓 ID
   * @param error - 에러
   */
  sendMessageFailed(
    socket: Socket,
    errorCode: EventErrorCode,
    message: string,
  ) {
    EventEmitUtil.emitFailed(
      socket,
      EventMessage.MESSAGE_FAILED,
      errorCode,
      message,
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
    EventEmitUtil.emitSuccess(socket, EventMessage.MESSAGE_SENT, response);
  }
}
