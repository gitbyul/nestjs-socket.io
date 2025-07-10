import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, LessThan, Repository } from 'typeorm';

import { ChatRooms } from '../entity/ChatRooms.entity';

import { GetChatRoomDto } from '../dto/get-chat-room.dto';
import { UpdateChatRoomLastMessageDto } from '../dto/update-chat-room-last-message.dto';

@Injectable()
export class ChatRoomRepository {
  constructor(
    @InjectRepository(ChatRooms)
    private chatRoomsRepository: Repository<ChatRooms>,
  ) {}

  /**
   * 채팅방 비활성화 예약 시간이 지난 채팅방 목록 조회
   * @returns 채팅방 목록
   */
  async getChatRoomListByDeactivationScheduledAt() {
    const chatRooms = await this.chatRoomsRepository.find({
      where: {
        alive: true,
        deactivationScheduledAt: LessThan(new Date()),
      },
    });
    return chatRooms;
  }

  /**
   * 채팅방 업데이트
   * @param chatRoomId 채팅방 ID
   * @param dto 업데이트 내용
   */
  async updateChatRoom(chatRoomId: string, dto: Partial<ChatRooms>) {
    await this.chatRoomsRepository.update(chatRoomId, dto);
  }

  /**
   * 채팅방 목록 조회
   * @param userId 사용자 ID
   * @returns 채팅방 목록
   */
  async getChatRoomList(userId: string) {
    const chatRooms = await this.chatRoomsRepository.find({
      where: {
        chatRoomMembers: {
          memberId: userId,
        },
      },
    });
    return chatRooms;
  }

  /**
   * 채팅방 목록 조회 (멤버 포함)
   * @param userId 사용자 ID
   * @returns 채팅방 목록
   */
  async getChatRoomListWithMember(userId: string) {
    const chatRooms = await this.chatRoomsRepository
      .createQueryBuilder('chatRoom')
      .leftJoinAndSelect('chatRoom.chatRoomMembers', 'chatRoomMember')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('crm.id')
          .from('chat_room_members', 'crm')
          .where('crm.member_id = :userId', { userId })
          .andWhere('crm.chat_room_id = chatRoom.id')
          .getQuery();
        return `EXISTS ${subQuery}`;
      })
      .getMany();
    return chatRooms;
  }

  /**
   * 활성 채팅방 목록 조회
   * @param userId 사용자 ID
   * @returns 활성 채팅방 목록
   */
  async getActiveChatRoomList(userId: string) {
    const chatRooms = await this.chatRoomsRepository.find({
      where: {
        chatRoomMembers: { memberId: userId },
        alive: true,
      },
    });

    return chatRooms;
  }

  /**
   * 채팅방 조회
   * @param chatRoomId 채팅방 ID
   * @param userId 사용자 ID
   * @returns 채팅방
   */
  async getChatRoom(dto: GetChatRoomDto) {
    return await this.chatRoomsRepository.findOne({
      where: { id: dto.chatRoomId, chatRoomMembers: { memberId: dto.userId } },
    });
  }
  async getChatRoomWithTransaction(
    manager: EntityManager,
    dto: GetChatRoomDto,
  ) {
    return await manager.findOne(ChatRooms, {
      where: { id: dto.chatRoomId, chatRoomMembers: { memberId: dto.userId } },
    });
  }

  /**
   * 채팅방 조회
   * @param chatRoomId 채팅방 ID
   * @returns 채팅방
   */
  async getChatRoomById(chatRoomId: string) {
    return await this.chatRoomsRepository.findOneByOrFail({ id: chatRoomId });
  }
  async getChatRoomByIdWithTransaction(
    manager: EntityManager,
    chatRoomId: string,
  ) {
    return await manager.findOne(ChatRooms, {
      where: { id: chatRoomId },
    });
  }

  /**
   * 채팅방 조회 (멤버 포함)
   * @param chatRoomId 채팅방 ID
   * @param userId 사용자 ID
   * @returns 채팅방
   */
  async getChatRoomWithMember(dto: GetChatRoomDto) {
    return await this.chatRoomsRepository.findOne({
      where: { id: dto.chatRoomId, chatRoomMembers: { memberId: dto.userId } },
      relations: ['chatRoomMembers'],
    });
  }

  /**
   * 채팅방 마지막 메시지 업데이트
   * @param chatRoomId - 채팅방 ID
   * @param message - 메시지
   * @param senderId - 보낸 사람 ID
   * @param senderType - 보낸 사람 타입
   */
  async updateLastMessageWithTransaction(
    manager: EntityManager,
    dto: UpdateChatRoomLastMessageDto,
  ) {
    await manager.update(ChatRooms, dto.chatRoomId, {
      lastMessageAt: new Date(),
      lastMessage: dto.message,
      lastMessageById: dto.senderId,
      lastMessageByRole: dto.senderType,
    });
  }
}
