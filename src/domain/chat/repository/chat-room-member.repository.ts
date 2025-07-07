import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { ChatRoomMembers } from '../entity/ChatRoomMembers.entity';
import { UpdateChatRoomMemberLastReadMessageDto } from '../dto/update-chat-room-member-last-read-message.dto';
import { UpdateChatRoomMemberUnreadMessageCountDto } from '../dto/update-chat-room-member-unread-message-count.dto';

@Injectable()
export class ChatRoomMemberRepository {
  constructor(
    @InjectRepository(ChatRoomMembers)
    private chatRoomMembersRepository: Repository<ChatRoomMembers>,
  ) {}

  /**
   * 채팅방 멤버 조회
   * @param chatRoomId 채팅방 ID
   * @param memberId 멤버 ID
   * @returns 채팅방 멤버
   */
  async getChatRoomMember(dto: { chatRoomId: string; memberId: string }) {
    return await this.chatRoomMembersRepository.findOne({
      where: { chatRoom: { id: dto.chatRoomId }, memberId: dto.memberId },
    });
  }
  async getChatRoomMemberWithTransaction(
    manager: EntityManager,
    dto: { chatRoomId: string; memberId: string },
  ) {
    return await manager.findOne(ChatRoomMembers, {
      where: { chatRoom: { id: dto.chatRoomId }, memberId: dto.memberId },
    });
  }

  /**
   * 채팅방 멤버 목록 조회
   * @param chatRoomId 채팅방 ID
   * @returns 채팅방 멤버
   */
  async getChatRoomMemberList(chatRoomId: string) {
    return await this.chatRoomMembersRepository.find({
      where: { chatRoom: { id: chatRoomId } },
    });
  }
  async getChatRoomMemberListWithTransaction(
    manager: EntityManager,
    chatRoomId: string,
  ) {
    return await manager.find(ChatRoomMembers, {
      where: { chatRoom: { id: chatRoomId } },
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
        unreadMessageCount: 0,
        lastReadMessageId: dto.lastReadMessageId,
        lastReadAt: new Date(),
      })
      .where('chat_room_id = :chatRoomId', { chatRoomId: dto.chatRoomId })
      .andWhere('member_id = :memberId', { memberId: dto.memberId })
      .execute();
  }

  /**
   * 채팅방 멤버 읽지 않은 메시지 수 업데이트
   * @param manager 엔티티 매니저
   * @param chatRoomId 채팅방 ID
   * @param memberId 멤버 ID
   */
  async updateUnreadMessageCountWithTransaction(
    manager: EntityManager,
    dto: UpdateChatRoomMemberUnreadMessageCountDto,
  ) {
    await manager
      .createQueryBuilder()
      .update(ChatRoomMembers)
      .set({
        unreadMessageCount: () => `unread_message_count + 1`,
      })
      .where('chat_room_id = :chatRoomId', { chatRoomId: dto.chatRoomId })
      .andWhere('member_id = :memberId', { memberId: dto.memberId })
      .execute();
  }
}
