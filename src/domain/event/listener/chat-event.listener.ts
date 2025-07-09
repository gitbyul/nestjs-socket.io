import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { LogUtil } from 'src/config/log/log.util';
import { ChatService } from 'src/domain/chat/servcie/chat.service';
import { SocketEmitService } from 'src/domain/chat/servcie/socket-emit.service';
import { ChatEventEmitter } from '../enums/event-emitter-type.enum';
import { SendFileMessageRequestDto } from '../request/send-file-message.request';
import { EventErrorCode } from 'src/domain/chat/enums/chat-error-code.enum';
import { ChatRoomNotFoundException } from 'src/config/exception/chat-room-not-found.exception';
import { UserNotFoundException } from 'src/config/exception/user-not-found.exception';
import { SocketNotFoundException } from 'src/config/exception/socket-not-found.exception';
import { SendSystemMessageRequestDto } from '../request/system-message.request';

@Injectable()
export class ChatEventListener implements OnModuleInit {
  private readonly logger: Logger = new Logger(ChatEventListener.name);

  constructor(
    private readonly logUtil: LogUtil,
    private readonly chatService: ChatService,
    private readonly socketEmitService: SocketEmitService,
  ) {}

  onModuleInit() {
    this.logger.log(
      'FileEventListener initialized and ready to listen for events',
    );
    this.logger.log('[handleFileMessage] chat.event.send-file-message');
  }

  /**
   * 파일 메시지 전송 이벤트 처리
   * @param payload 파일 메시지 전송 이벤트 페이로드
   * @event chat.event.send-file-message
   * @websocketListener send-message-success 파일 메시지 전송 성공
   * @websocketListener new-message 새 파일 메시지 수신
   * @websocketListener unread-count-updated 읽지 않은 메시지 수 업데이트
   * @websocketListener send-message-failed 파일 메시지 전송 실패
   */
  @OnEvent(ChatEventEmitter.SEND_FILE_MESSAGE)
  async handleFileMessage(payload: SendFileMessageRequestDto) {
    this.logUtil.EventInfo(
      `[${ChatEventEmitter.SEND_FILE_MESSAGE}][${payload.eventId}]Event received: ${JSON.stringify(payload)}`,
    );
    const socket = this.chatService.getUserConnectionSocket(payload.senderId);
    try {
      if (!socket) {
        throw new SocketNotFoundException(payload.senderId);
      }

      // 1. 메시지 저장
      const userInfo = {
        userId: payload.senderId,
        userRole: payload.senderType,
      };
      const body = {
        chatRoomId: payload.chatRoomId,
        fileId: payload.fileId,
      };
      const {
        chatRoomId,
        message,
        file,
        type,
        createdAt,
        unreadCountMemberList,
      } = await this.chatService.sendFileMessage(userInfo, body);

      const dto = { chatRoomId, message, file, type, createdAt };
      this.socketEmitService.sendMessageSuccess(socket, dto);
      this.socketEmitService.newMessage(socket, userInfo, dto);
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
      this.logUtil.EventInfo(
        `[${ChatEventEmitter.SEND_FILE_MESSAGE}][${payload.eventId}]Event completed : ${JSON.stringify(dto)}`,
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
        case SocketNotFoundException:
          errorCode = EventErrorCode.INTERNAL_ERROR;
          break;
      }
      if (socket) {
        this.socketEmitService.sendMessageFailed(socket, errorCode, error);
      }
      this.logUtil.EventError(
        `[${ChatEventEmitter.SEND_FILE_MESSAGE}][${payload.eventId}]Event failed : ${error.message}`,
      );
    }
  }

  @OnEvent(ChatEventEmitter.SEND_SYSTEM_MESSAGE)
  async handleSystemMessage(payload: SendSystemMessageRequestDto) {
    this.logUtil.EventInfo(
      `[${payload.eventId}]Event received: ${JSON.stringify(payload)}`,
    );

    try {
      const userInfo = {
        userId: payload.senderId,
        userRole: payload.senderType,
      };
      const body = {
        chatRoomId: payload.chatRoomId,
        systemMessage: payload.systemMessage,
      };
      // 1. 시스템 메시지 저장
      await this.chatService.sendSystemMessage(userInfo, body);

      this.logUtil.EventInfo(
        `[${ChatEventEmitter.SEND_SYSTEM_MESSAGE}][${payload.eventId}]Event completed : ${JSON.stringify(payload)}`,
      );
    } catch (error) {
      let errorCode = EventErrorCode.INTERNAL_ERROR;
      const errorMessage = error.message ?? error;
      switch (error.constructor) {
        case UserNotFoundException:
          errorCode = EventErrorCode.USER_NOT_FOUND;
          break;
        case ChatRoomNotFoundException:
          errorCode = EventErrorCode.CHAT_ROOM_NOT_FOUND;
          break;
        case SocketNotFoundException:
          errorCode = EventErrorCode.INTERNAL_ERROR;
          break;
      }
      this.logUtil.EventError(
        `[${ChatEventEmitter.SEND_SYSTEM_MESSAGE}][${payload.eventId}]Event failed : ${errorMessage}`,
      );
    }
  }
}
