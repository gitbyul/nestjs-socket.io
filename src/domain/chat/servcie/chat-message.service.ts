import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

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
   * @param manager - 엔티티 매니저
   * @param messageData - 메시지 데이터
   * @returns 저장된 메시지
   */
  async createWithTransaction(
    manager: EntityManager,
    messageData: {
      chatRoomId: string;
      templateId?: string;
      message: string;
      type: ChatMessageType;
      senderType: UserRole;
      senderId: string;
    },
  ) {
    const entity = ChatMessages.newMessage({
      chatRoomId: messageData.chatRoomId,
      templateId: messageData.templateId ?? undefined,
      message: messageData.message,
      type: messageData.type,
      senderType: messageData.senderType,
      senderId: messageData.senderId,
    });
    return await manager.save(ChatMessages, entity);
  }
}
