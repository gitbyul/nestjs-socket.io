import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { ChatRoomMembers } from '../entity/ChatRoomMembers.entity';
import { UpdateChatRoomMemberLastReadMessageDto } from '../dto/update-chat-room-member-last-read-message.dto';

@Injectable()
export class ChatRoomMemberService {
  constructor(
    @InjectRepository(ChatRoomMembers)
    private chatRoomMembersRepository: Repository<ChatRoomMembers>,
  ) {}

  async getChatRoomMemberWithTransaction(
    manager: EntityManager,
    dto: { chatRoomId: string; memberId: string },
  ) {
    return await manager.findOne(ChatRoomMembers, {
      where: { chatRoom: { id: dto.chatRoomId }, memberId: dto.memberId },
    });
  }

  /**
   * 채팅방 멤버 마지막 읽은 메시지 업데이트
   * @param chatRoomId - 채팅방 ID
   * @param memberId - 멤버 ID
   * @param lastReadMessageId - 마지막 읽은 메시지 ID
   */
  async updateLastReadMessageWithTransaction(
    manager: EntityManager,
    dto: UpdateChatRoomMemberLastReadMessageDto,
  ) {
    await manager
      .createQueryBuilder()
      .update(ChatRoomMembers)
      .set({
        lastReadMessageId: dto.lastReadMessageId,
        lastReadAt: new Date(),
      })
      .where('chat_room_id = :chatRoomId', { chatRoomId: dto.chatRoomId })
      .andWhere('member_id = :memberId', { memberId: dto.memberId })
      .execute();
  }
}
