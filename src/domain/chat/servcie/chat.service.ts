import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Socket } from 'socket.io';
import { DataSource } from 'typeorm';
import { LogUtil } from 'src/config/log/log.util';

import { EventPayloadMap } from '../type/event-payload.map';
import { UserPayload } from 'src/config/type/user-payload.type';
import { IMemoryUserConnectionInfo } from '../interface/memory-user-connection-info.interface';
import { ConnectionStatus } from '../enums/connection-state.enum';
import { UserRole } from 'src/domain/auth/enums/user-role.enum';
import { EventMessage } from '../enums/chat-event-type.enum';

import { ChatRoomRepository } from '../repository/chat-room.repository';
import { ChatMessageRepository } from '../repository/chat-message.repository';
import { ChatRoomMemberRepository } from '../repository/chat-room-member.repository';
import { ChatConnectionRepository } from '../repository/chat-connection.repository';
import { UserService } from 'src/domain/user/service/user.service';

import { SendMessageRequestDto } from '../dto/request/send-message.request';

import { UserNotFoundException } from 'src/config/exception/user-not-found.exception';
import { ChatRoomNotFoundException } from 'src/config/exception/chat-room-not-found.exception';
import { ReadMessageRequestDto } from '../dto/request/read-message.request';
import { ChatMessageType } from '../enums/chat-message-type.enum';
import { ChatMessageNotFoundException } from 'src/config/exception/chat-message-not-found.exception';
import { ChatRoomMemberNotFoundException } from 'src/config/exception/chat-room-member-not-found.exception';
import { ChatRoomMemberReadMessageOrderInvalidException } from 'src/config/exception/chat-room-member-read-message-order-invalid.exception';
import { ChatRoomMemberReadMessageSameIdException } from 'src/config/exception/chat-room-member-read-message-same-id.exception';
import { FileRepository } from 'src/domain/file/repository/file.repository';
import { FileNotFoundException } from 'src/config/exception/file-not-found.exception';
import { SystemMessageDto } from 'src/domain/system-message/dto/system-message.dto';

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
    private readonly chatRoomRepository: ChatRoomRepository,
    private readonly chatRoomMemberRepository: ChatRoomMemberRepository,
    private readonly chatMessageRepository: ChatMessageRepository,
    private readonly chatConnectionRepository: ChatConnectionRepository,
    private readonly userService: UserService,
    @Inject(forwardRef(() => FileRepository))
    private readonly fileRepository: FileRepository,
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

    // 채팅방 목록 조회
    const activeChatRooms = await this.chatRoomRepository.getActiveChatRoomList(
      userPayload.id,
    );

    activeChatRooms.forEach((chatRoom) => {
      socket.join(chatRoom.id);
    });

    // 소켓 연결 정보 저장
    this.socketToUserMap.set(socket.id, userPayload.id);
    // 사용자 연결 정보 저장
    this.userConnections.set(userPayload.id, userConnectionInfo);

    // DB에 연결 정보 저장
    await this.chatConnectionRepository.connection(
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

      // TODO: 채팅방 로그아웃 알림 전송 로직 추가
      // // 채팅방 로그아웃 알림 전송
      // connectionInfo.joinedChatRooms.forEach(async (chatRoomId) => {
      //   const roomUsers = this.chatRoomUsers.get(chatRoomId);
      //   if (roomUsers) {
      //     // 메모리에서 채팅방 유저 정보 삭제
      //     roomUsers.delete(userId);
      //     // // 채팅방 유저 정보 삭제 이벤트 전송 -- gateway 에서 처리로
      //     // this.broadcastUserLeftChatRoom(chatRoomId, userId);
      //     // // DB에서 채팅방 로그아웃 처리
      //     // await this.chatRoomMemberRepository.leaveRoom(userId, chatRoomId);
      //   }
      // });

      // 사용자 연결 정보 삭제
      this.userConnections.delete(userId);
      this.socketToUserMap.delete(socketId);

      // DB에서 연결 정보 삭제
      await this.chatConnectionRepository.disconnect(userId, socketId);
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
   * 사용자 연결 소켓 조회 (메모리)
   * @param userId 사용자 ID
   * @returns 사용자 연결 소켓
   */
  getUserConnectionSocket(userId: string): Socket | undefined {
    const connectionInfo = this.userConnections.get(userId);
    return connectionInfo?.socket;
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
   * 읽지 않은 메시지 수 요약
   * @param user 사용자 정보
   * @returns 읽지 않은 메시지 수 요약
   */
  async unreadCountSummary(userId: string) {
    const chatRoomList =
      await this.chatRoomRepository.getChatRoomListWithMember(userId);

    const unreadCountSummary = chatRoomList
      .map((chatRoom) => {
        const chatRoomMember = chatRoom.chatRoomMembers.find(
          (member) => member.memberId === userId,
        );
        if (!chatRoomMember) {
          return null;
        }

        return {
          chatRoomId: chatRoom.id,
          unreadCount: chatRoomMember.unreadMessageCount,
          updatedAt: chatRoomMember.lastReadAt,
        };
      })
      .filter((item) => item !== null);

    return unreadCountSummary;
  }

  /**
   * 채팅방 목록 조회
   * @param userId 사용자 ID
   * @returns 채팅방 목록
   */
  async getChatRoomListWithMember(userId: string) {
    const chatRooms =
      await this.chatRoomRepository.getChatRoomListWithMember(userId);
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
  ) {
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

        // 2. 채팅방 조회
        const chatRoom =
          await this.chatRoomRepository.getChatRoomWithTransaction(manager, {
            chatRoomId: body.chatRoomId,
            userId: user.userId,
          });
        if (!chatRoom) {
          throw new ChatRoomNotFoundException(body.chatRoomId, user.userId);
        }

        // 3. 채팅방 멤버 조회
        const chatRoomMember =
          await this.chatRoomMemberRepository.getChatRoomMemberWithTransaction(
            manager,
            {
              chatRoomId: chatRoom.id,
              memberId: user.userId,
            },
          );
        if (!chatRoomMember) {
          throw new ChatRoomMemberNotFoundException(chatRoom.id, user.userId);
        }

        // 4. 메시지 저장
        const chatMessage =
          await this.chatMessageRepository.createWithTransaction(manager, {
            chatRoomId: body.chatRoomId,
            message: body.message,
            type: ChatMessageType.TEXT,
            senderType: user.userRole,
            senderId: user.userId,
          });

        // 5. 채팅방 마지막 메시지 업데이트
        await this.chatRoomRepository.updateLastMessageWithTransaction(
          manager,
          {
            chatRoomId: body.chatRoomId,
            message: body.message,
            senderType: user.userRole,
            senderId: user.userId,
          },
        );

        // 6. 채팅방 멤버 상태값 업데이트
        await this.chatRoomMemberRepository.updateLastReadMessageWithTransaction(
          manager,
          {
            chatRoomId: chatRoom.id,
            memberId: user.userId,
            lastReadMessageId: chatMessage.id,
          },
        );

        // 7. 채팅방 멤버 목록 조회
        const chatRoomMemberList =
          await this.chatRoomMemberRepository.getChatRoomMemberList(
            chatRoom.id,
          );

        // 8. 채팅방 멤버 목록 순회
        const unreadChatRoomMemberList = chatRoomMemberList.filter(
          (chatRoomMember) => chatRoomMember.memberId !== user.userId,
        );
        for (const chatRoomMember of unreadChatRoomMemberList) {
          // 9. 채팅방 멤버 읽지 않은 메시지 수 업데이트
          await this.chatRoomMemberRepository.updateUnreadMessageCountWithTransaction(
            manager,
            {
              chatRoomId: chatRoom.id,
              memberId: chatRoomMember.memberId,
            },
          );
        }

        // 10. 채팅 멤버, SocketId 데이터 병합
        const unreadCountMemberList = unreadChatRoomMemberList.map(
          (chatRoomMember) => {
            const connectionInfo = this.getUserConnectionInfo(
              chatRoomMember.memberId,
            );
            const socketId = connectionInfo?.socketId;
            return {
              chatRoomId: chatRoom.id,
              socketId: socketId,
              memberId: chatRoomMember.memberId,
              unreadCount: chatRoomMember.unreadMessageCount + 1,
              createdAt: chatMessage.createdAt,
            };
          },
        );

        return {
          chatRoomId: chatRoom.id,
          message: {
            messageId: chatMessage.id,
            message: body.message,
          },
          type: ChatMessageType.TEXT,
          createdAt: new Date(),
          unreadCountMemberList,
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
   * 메시지 읽음 처리
   * @param user 사용자 정보
   * @param chatRoomId 채팅방 ID
   * @param messageId 메시지 ID
   * @returns 메시지 읽음 처리 성공 정보
   */
  async readMessage(
    user: { userId: string; userRole: UserRole },
    body: ReadMessageRequestDto,
  ): Promise<EventPayloadMap[EventMessage.READ_MESSAGE_SUCCESS]> {
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

        // 2. 채팅방 조회
        const chatRoom =
          await this.chatRoomRepository.getChatRoomWithTransaction(manager, {
            chatRoomId: body.chatRoomId,
            userId: user.userId,
          });
        if (!chatRoom) {
          throw new ChatRoomNotFoundException(body.chatRoomId, user.userId);
        }

        // 3. 채팅방 멤버 조회
        const chatRoomMember =
          await this.chatRoomMemberRepository.getChatRoomMemberWithTransaction(
            manager,
            {
              chatRoomId: chatRoom.id,
              memberId: user.userId,
            },
          );
        if (!chatRoomMember) {
          throw new ChatRoomMemberNotFoundException(chatRoom.id, user.userId);
        }

        // 4. 메시지 조회
        const chatMessages =
          await this.chatMessageRepository.getChatMessageListWithTransaction(
            manager,
            {
              chatRoomId: body.chatRoomId,
              messageIds: [
                body.messageId,
                chatRoomMember.lastReadMessageId ?? '',
              ],
            },
          );

        const currentMessage = chatMessages.find(
          (message) => message.id === body.messageId,
        );
        const previousMessage = chatMessages.find(
          (message) => message.id === chatRoomMember.lastReadMessageId,
        );

        // 입력받은 메세지가 조회되지 않은 경우 예외 발생
        if (!currentMessage) {
          throw new ChatMessageNotFoundException(
            body.messageId,
            body.chatRoomId,
          );
        }

        // 입력받은 메세지가 기존 메세지와 동일한 경우 예외 발생
        if (currentMessage.id === previousMessage?.id) {
          throw new ChatRoomMemberReadMessageSameIdException(
            body.chatRoomId,
            user.userId,
            body.messageId,
            previousMessage.id,
          );
        }

        // 저장되어 있던 과거 메세지가 입력받은 메세지보다 신규 메세지 인 경우 예외 발생
        if (
          previousMessage?.createdAt &&
          currentMessage.createdAt &&
          previousMessage.createdAt > currentMessage.createdAt
        ) {
          throw new ChatRoomMemberReadMessageOrderInvalidException(
            body.messageId,
            currentMessage.createdAt,
            previousMessage.id,
            previousMessage.createdAt,
            user.userId,
          );
        }

        // 5. chat_room_members 상태값 업데이트
        await this.chatRoomMemberRepository.updateLastReadMessageWithTransaction(
          manager,
          {
            chatRoomId: chatRoom.id,
            memberId: user.userId,
            lastReadMessageId: body.messageId,
          },
        );

        return {
          chatRoomId: chatRoom.id,
          messageId: body.messageId,
          readerId: user.userId,
          readerType: user.userRole,
          createdAt: new Date(),
        };
      } catch (error) {
        this.logUtil.error(
          `[ChatService][readMessage] readMessage failed: ${error}`,
        );
        throw error;
      }
    });
  }

  /**
   * 파일 메시지 전송
   * @param user 사용자 정보
   * @param chatRoomId 채팅방 ID
   * @param fileId 파일 ID
   * @returns 파일 메시지 전송 성공 정보
   */
  sendFileMessage(
    user: { userId: string; userRole: UserRole },
    body: {
      chatRoomId: string;
      fileId: string;
    },
  ) {
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

        // 2. 채팅방 조회
        const chatRoom =
          await this.chatRoomRepository.getChatRoomWithTransaction(manager, {
            chatRoomId: body.chatRoomId,
            userId: user.userId,
          });
        if (!chatRoom) {
          throw new ChatRoomNotFoundException(body.chatRoomId, user.userId);
        }

        // 3. 채팅방 멤버 조회
        const chatRoomMember =
          await this.chatRoomMemberRepository.getChatRoomMemberWithTransaction(
            manager,
            {
              chatRoomId: chatRoom.id,
              memberId: user.userId,
            },
          );
        if (!chatRoomMember) {
          throw new ChatRoomMemberNotFoundException(chatRoom.id, user.userId);
        }

        // 4. 파일 조회
        const fileEntity =
          await this.fileRepository.findByFileIdWithTransaction(manager, {
            fileId: body.fileId,
          });
        if (!fileEntity) {
          throw new FileNotFoundException(body.fileId);
        }

        // 5. 파일 메시지 저장
        const chatMessage =
          await this.chatMessageRepository.createWithTransaction(manager, {
            chatRoomId: body.chatRoomId,
            type: ChatMessageType.FILE,
            senderType: user.userRole,
            senderId: user.userId,
          });

        // 6. 파일 RelatedId 업데이트
        await this.fileRepository.updateFileWithTransaction(manager, {
          fileId: body.fileId,
          relatedId: chatMessage.id,
        });

        // 7. 채팅방 마지막 메시지 업데이트
        await this.chatRoomRepository.updateLastMessageWithTransaction(
          manager,
          {
            chatRoomId: body.chatRoomId,
            message: fileEntity.originalFilename,
            senderType: user.userRole,
            senderId: user.userId,
          },
        );

        // 8. 채팅방 멤버(Sender) 상태값 업데이트
        await this.chatRoomMemberRepository.updateLastReadMessageWithTransaction(
          manager,
          {
            chatRoomId: chatRoom.id,
            memberId: user.userId,
            lastReadMessageId: chatMessage.id,
          },
        );

        // 9. 채팅방 멤버 목록 조회
        const chatRoomMemberList =
          await this.chatRoomMemberRepository.getChatRoomMemberList(
            chatRoom.id,
          );

        // 10. 채팅방 멤버 목록 순회
        const unreadChatRoomMemberList = chatRoomMemberList.filter(
          (chatRoomMember) => chatRoomMember.memberId !== user.userId,
        );
        for (const chatRoomMember of unreadChatRoomMemberList) {
          // 11. 채팅방 멤버 읽지 않은 메시지 수 업데이트
          await this.chatRoomMemberRepository.updateUnreadMessageCountWithTransaction(
            manager,
            {
              chatRoomId: chatRoom.id,
              memberId: chatRoomMember.memberId,
            },
          );
        }

        // 11. 채팅 멤버, SocketId 데이터 병합
        const unreadCountMemberList = unreadChatRoomMemberList.map(
          (chatRoomMember) => {
            const connectionInfo = this.getUserConnectionInfo(
              chatRoomMember.memberId,
            );
            const socketId = connectionInfo?.socketId;
            return {
              chatRoomId: chatRoom.id,
              socketId: socketId,
              memberId: chatRoomMember.memberId,
              unreadCount: chatRoomMember.unreadMessageCount + 1,
              createdAt: chatMessage.createdAt,
            };
          },
        );

        return {
          chatRoomId: chatRoom.id,
          message: {
            messageId: chatMessage.id,
          },
          file: {
            fileId: body.fileId,
            originalFilename: fileEntity.originalFilename,
            mimetype: fileEntity.mimetype,
            size: fileEntity.size,
            path: fileEntity.path,
            url: fileEntity.url,
            orderNumber: fileEntity.orderNumber ?? undefined,
          },
          type: ChatMessageType.FILE,
          createdAt: new Date(),
          unreadCountMemberList,
        };
      } catch (error) {
        this.logUtil.error(
          `[ChatService][sendFileMessage] sendFileMessage failed: ${error}`,
        );
        throw error;
      }
    });
  }

  /**
   * 시스템 메시지 전송
   * @param user 사용자 정보
   * @param chatRoomId 채팅방 ID
   * @param systemMessage 시스템 메시지
   * @returns 시스템 메시지 전송 성공 정보
   */
  async sendSystemMessage(
    user: { userId: string; userRole: UserRole },
    body: { chatRoomId: string; systemMessage: SystemMessageDto },
  ) {
    try {
      return this.dataSource.transaction(async (manager) => {
        // 1. 채팅방 조회
        const chatRoom =
          await this.chatRoomRepository.getChatRoomWithTransaction(manager, {
            chatRoomId: body.chatRoomId,
            userId: user.userId,
          });
        if (!chatRoom) {
          throw new ChatRoomNotFoundException(body.chatRoomId);
        }

        // 2. 시스템 메시지 저장
        const chatMessage =
          await this.chatMessageRepository.createWithTransaction(manager, {
            chatRoomId: body.chatRoomId,
            type: ChatMessageType.SYSTEM,
            senderType: user.userRole,
            senderId: user.userId,
            systemMessage: body.systemMessage,
          });

        // 3. 채팅방 마지막 메세지 업데이트
        await this.chatRoomRepository.updateLastMessageWithTransaction(
          manager,
          {
            chatRoomId: body.chatRoomId,
            message: body.systemMessage.title,
            senderType: user.userRole,
            senderId: user.userId,
          },
        );

        // 4. 채팅방 멤버 목록 조회
        const chatRoomMemberList =
          await this.chatRoomMemberRepository.getChatRoomMemberList(
            chatRoom.id,
          );

        // 5. 채팅방 멤버 목록 순회
        const unreadChatRoomMemberList = chatRoomMemberList.filter(
          (chatRoomMember) => chatRoomMember.memberId !== user.userId,
        );
        for (const chatRoomMember of unreadChatRoomMemberList) {
          // 6. 채팅방 멤버 읽지 않은 메시지 수 업데이트
          await this.chatRoomMemberRepository.updateUnreadMessageCountWithTransaction(
            manager,
            {
              chatRoomId: chatRoom.id,
              memberId: chatRoomMember.memberId,
            },
          );
        }

        // 7. 채팅 멤버, SocketId 데이터 병합
        const unreadCountMemberList = unreadChatRoomMemberList.map(
          (chatRoomMember) => {
            const connectionInfo = this.getUserConnectionInfo(
              chatRoomMember.memberId,
            );
            const socketId = connectionInfo?.socketId;
            return {
              chatRoomId: chatRoom.id,
              socketId: socketId,
              memberId: chatRoomMember.memberId,
              unreadCount: chatRoomMember.unreadMessageCount + 1,
              createdAt: chatMessage.createdAt,
            };
          },
        );

        return {
          chatRoomId: chatRoom.id,
          message: {
            messageId: chatMessage.id,
          },
          systemMessage: body.systemMessage,
          type: ChatMessageType.SYSTEM,
          createdAt: new Date(),
          unreadCountMemberList,
        };
      });
    } catch (error) {
      this.logUtil.error(
        `[ChatService][sendSystemMessage] sendSystemMessage failed: ${error}`,
      );
      throw error;
    }
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
      socket: socket,
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
