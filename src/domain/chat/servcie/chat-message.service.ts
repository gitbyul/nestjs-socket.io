import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';

import { ChatMessages } from '../entity/ChatMessages.entity';
import { ChatMessageType } from '../enums/chat-message-type.enum';
import { UserRole } from 'src/domain/auth/enums/user-role.enum';

@Injectable()
export class ChatMessageService {
  constructor(
    @InjectRepository(ChatMessages)
    private chatMessagesRepository: Repository<ChatMessages>,
  ) {}

  /**
   * 메시지 저장
   * @param chatRoomId - 채팅방 ID
   * @param templateId - 템플릿 ID
   * @param message - 메시지
   * @param type - 메시지 타입
   * @param senderType - 발신자 타입
   * @param senderId - 발신자 ID
   * @returns 저장된 메시지
   */
  async createWithTransaction(
    manager: EntityManager,
    messageData: {
      chatRoomId: string;
      templateId?: string;
      message?: string;
      type: ChatMessageType;
      senderType: UserRole;
      senderId: string;
    },
  ) {
    const entity = ChatMessages.newMessage({
      chatRoomId: messageData.chatRoomId,
      templateId: messageData.templateId ?? undefined,
      message: messageData.message ?? undefined,
      type: messageData.type,
      senderType: messageData.senderType,
      senderId: messageData.senderId,
    });
    return await manager.save(ChatMessages, entity);
  }

  /**
   * 메시지 조회
   * @param chatRoomId - 채팅방 ID
   * @param messageId - 메시지 ID
   * @returns 메시지
   */
  async getChatMessageWithTransaction(
    manager: EntityManager,
    messageData: {
      chatRoomId: string;
      messageId: string;
    },
  ) {
    const chatMessage = await manager.findOne(ChatMessages, {
      where: {
        id: messageData.messageId,
        chatRoom: { id: messageData.chatRoomId },
      },
    });
    return chatMessage;
  }

  /**
   * 채팅방 메시지 목록 조회
   * @param chatRoomId - 채팅방 ID
   * @param messageIds - 메시지 ID 목록
   * @returns 메시지 목록
   */
  async getChatMessageListWithTransaction(
    manager: EntityManager,
    messageData: {
      chatRoomId: string;
      messageIds: string[];
    },
  ) {
    const chatMessage = await manager.find(ChatMessages, {
      where: {
        id: In(messageData.messageIds),
        chatRoom: { id: messageData.chatRoomId },
      },
    });
    return chatMessage;
  }
}
