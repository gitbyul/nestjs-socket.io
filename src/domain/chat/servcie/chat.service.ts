import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { DataSource } from 'typeorm';
import { LogUtil } from 'src/config/log/log.util';

import { EventPayloadMap } from '../type/event-payload.map';
import { UserPayload } from 'src/config/type/user-payload.type';
import { IMemoryUserConnectionInfo } from '../interface/memory-user-connection-info.interface';
import { ConnectionStatus } from '../enums/connection-state.enum';
import { UserRole } from 'src/domain/auth/enums/user-role.enum';
import { EventMessage } from '../enums/chat-event-type.enum';

import { ChatRoomService } from './chat-room.service';
import { ChatMessageService } from './chat-message.service';
import { ChatTemplateService } from './chat-templates.service';
import { ChatRoomMemberService } from './chat-room-member.service';
import { ChatConnectionService } from './chat-connection.service';
import { UserService } from 'src/domain/user/service/user.service';

import { SendMessageRequestDto } from '../dto/send-message.request';

import { UserNotFoundException } from 'src/config/exception/user-not-found.exception';
import { ChatRoomNotFoundException } from 'src/config/exception/chat-room-not-found.exception';

@Injectable()
export class ChatService {
  // 사용자 연결 정보 관리 (유저ID, 연결정보)
  private readonly userConnections: Map<string, IMemoryUserConnectionInfo> =
    new Map();
  // 소켓 연결 정보 관리 (역방향 조회용) (소켓ID, 유저ID)
  private readonly socketToUserMap: Map<string, string> = new Map();
  // 채팅방 유저 관리 (채팅방ID, 유저ID 집합)
  private readonly chatRoomUsers: Map<string, Set<string>> = new Map();

  constructor(
    private readonly logUtil: LogUtil,
    private readonly dataSource: DataSource,
    private readonly chatRoomService: ChatRoomService,
    private readonly chatRoomMemberService: ChatRoomMemberService,
    private readonly chatMessageService: ChatMessageService,
    private readonly chatTemplateService: ChatTemplateService,
    private readonly chatConnectionService: ChatConnectionService,
    private readonly userService: UserService,
  ) {}

  /**
   * 사용자 연결 정보 초기화
   * @param userPayload 사용자 정보
   * @param socket 소켓 정보
   */
  async initializeUserConnection(userPayload: UserPayload, socket: Socket) {
    const userConnectionInfo = this.createUserConnectionInfo(
      userPayload,
      socket,
    );

    // 소켓 연결 정보 저장
    this.socketToUserMap.set(socket.id, userPayload.id);
    // 사용자 연결 정보 저장
    this.userConnections.set(userPayload.id, userConnectionInfo);

    // DB에 연결 정보 저장
    await this.chatConnectionService.connection(
      userPayload.id,
      userPayload.role,
      socket.id,
    );
  }

  /**
   * 사용자 연결 종료 사전 작업 (메모리, DB)
   * @param socket 소켓 정보
   */
  async disconnectUserWithDatabaseAndMemory(socket: Socket) {
    const socketId = socket.id;
    try {
      // 소켓ID로 유저ID 조회
      const userId = this.socketToUserMap.get(socketId);
      if (!userId) {
        this.logUtil.error(
          `[ChatService][disconnectUserWithDatabaseAndMemory] disconnectUser: userId not found ${socketId}`,
        );
        return;
      }

      // 사용자 연결 정보 조회
      const connectionInfo = this.userConnections.get(userId);
      if (!connectionInfo) {
        this.logUtil.error(
          `[ChatService][disconnectUserWithDatabaseAndMemory] disconnectUser: connectionInfo not found ${userId}`,
        );
        return;
      }

      // // 채팅방 로그아웃 알림 전송
      // connectionInfo.joinedChatRooms.forEach(async (chatRoomId) => {
      //   const roomUsers = this.chatRoomUsers.get(chatRoomId);
      //   if (roomUsers) {
      //     // 메모리에서 채팅방 유저 정보 삭제
      //     roomUsers.delete(userId);
      //     // // 채팅방 유저 정보 삭제 이벤트 전송 -- gateway 에서 처리로
      //     // this.broadcastUserLeftChatRoom(chatRoomId, userId);
      //     // // DB에서 채팅방 로그아웃 처리
      //     // await this.chatRoomMemberService.leaveRoom(userId, chatRoomId);
      //   }
      // });

      // 사용자 연결 정보 삭제
      this.userConnections.delete(userId);
      this.socketToUserMap.delete(socketId);

      // DB에서 연결 정보 삭제
      await this.chatConnectionService.disconnect(userId, socketId);
    } catch (error) {
      this.logUtil.error(
        `[ChatService][disconnectUserWithDatabaseAndMemory] disconnectUser: ${error} ${socketId}`,
      );
    }
  }

  /**
   * 사용자 연결 정보 조회 (메모리)
   * @param userId 사용자 ID
   * @returns 사용자 연결 정보
   */
  getUserConnectionInfo(userId: string): IMemoryUserConnectionInfo | undefined {
    return this.userConnections.get(userId);
  }

  /**
   * 소켓ID로 사용자 ID 조회 (메모리)
   * @param socketId 소켓 ID
   * @returns 사용자 ID
   */
  getUserIdBySocketId(socketId: string): string | undefined {
    return this.socketToUserMap.get(socketId);
  }

  /**
   * 사용자 마지막 활동 시간 업데이트
   * @param userId 사용자 ID
   */
  updateUserLastActivity(userId: string) {
    const connectionInfo = this.userConnections.get(userId);
    if (!connectionInfo) {
      this.logUtil.error(
        `[ChatService][updateUserLastActivity] updateUserLastActivity: connectionInfo not found ${userId}`,
      );
      return;
    }
    connectionInfo.lastActivityAt = new Date();
    connectionInfo.lastHeartbeatAt = new Date();
    connectionInfo.status = ConnectionStatus.CONNECTED;
  }

  /**
   * 채팅방 목록 조회
   * @param userId 사용자 ID
   * @returns 채팅방 목록
   */
  async getChatRooms(userId: string) {
    const chatRooms = await this.chatRoomService.getChatRooms(userId);
    chatRooms.forEach((chatRoom) => {
      const roomUsers = this.chatRoomUsers.get(chatRoom.id);
      if (!roomUsers) {
        this.chatRoomUsers.set(chatRoom.id, new Set([userId]));
      } else {
        roomUsers.add(userId);
      }
    });
    return chatRooms;
  }

  /**
   * 텍스트 메시지 전송
   * @param user 사용자 정보
   * @param chatRoomId 채팅방 ID
   * @param message 메시지
   * @param messageType 메시지 타입
   * @param templateId 템플릿 ID (Optional)
   * @returns 메시지 정보
   */
  async sendTextMessage(
    user: { userId: string; userRole: UserRole },
    body: SendMessageRequestDto,
  ): Promise<EventPayloadMap[EventMessage.MESSAGE_SENT]> {
    return this.dataSource.transaction(async (manager) => {
      try {
        // 1. 사용자 조회
        const userExists = await this.userService.existsById(
          user.userId,
          user.userRole,
        );
        if (!userExists) {
          throw new UserNotFoundException(user.userId, user.userRole);
        }

        // 2. chat_rooms(채팅방) 조회
        const chatRoom = await this.chatRoomService.getChatRoomWithTransaction(
          manager,
          {
            chatRoomId: `body.chatRoomId`,
            userId: user.userId,
          },
        );
        if (!chatRoom) {
          throw new ChatRoomNotFoundException(body.chatRoomId, user.userId);
        }

        // 3. 메시지 저장
        const chatMessage = await this.chatMessageService.createWithTransaction(
          manager,
          {
            chatRoomId: body.chatRoomId,
            templateId: body.templateId ?? undefined,
            message: body.message,
            type: body.messageType,
            senderType: user.userRole,
            senderId: user.userId,
          },
        );

        // 4. chat_rooms 상태값 업데이트
        await this.chatRoomService.updateLastMessageWithTransaction(manager, {
          chatRoomId: body.chatRoomId,
          message: body.message,
          senderType: user.userRole,
          senderId: user.userId,
        });

        // 5. chat_room_members 상태값 업데이트
        await this.chatRoomMemberService.updateLastReadMessageWithTransaction(
          manager,
          {
            chatRoomId: chatRoom.id,
            memberId: user.userId,
            lastReadMessageId: chatMessage.id,
          },
        );

        return {
          chatRoomId: chatRoom.id,
          messageId: chatMessage.id,
          message: body.message,
          type: body.messageType,
          createdAt: new Date(),
        };
      } catch (error) {
        this.logUtil.error(
          `[ChatService][sendTextMessage] sendMessage failed: ${error}`,
        );
        throw error;
      }
    });
  }

  /**
   * 사용자 연결 정보 생성
   * @param userPayload 사용자 정보
   * @param socket 소켓 정보
   * @returns 사용자 연결 정보
   */
  private createUserConnectionInfo(userPayload: UserPayload, socket: Socket) {
    const userConnectionInfo: IMemoryUserConnectionInfo = {
      userId: userPayload.id,
      socketId: socket.id,
      userRole: userPayload.role,
      connectedAt: new Date(),
      lastActivityAt: new Date(),
      lastHeartbeatAt: new Date(),
      status: ConnectionStatus.CONNECTED,
      joinedChatRooms: [],
    };

    return userConnectionInfo;
  }
}
