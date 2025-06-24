import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { ChatRoomMembers } from './ChatRoomMembers.entity';
import { ChatMessages } from './ChatMessages.entity';

import { UserRole } from 'src/domain/auth/enums/user-role.enum';
import { ChatRoomType } from 'src/domain/chat/enums/chat-room-type.enums';

@Entity({ name: 'chat_rooms' })
export class ChatRooms {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'chat_room_type',
    type: 'enum',
    enum: ChatRoomType,
    nullable: false,
    comment: '채팅방 타입',
  })
  chatRoomType: ChatRoomType;

  @Column({
    name: 'chat_room_related_id',
    type: 'uuid',
    nullable: false,
    comment: '채팅방 연관 ID',
  })
  chatRoomRelatedId: string;

  @Column({
    name: 'operator_id',
    type: 'uuid',
    nullable: false,
    comment: '채팅방 생성자 ID',
  })
  operatorId: string;

  @Column({
    name: 'operator_type',
    type: 'enum',
    enum: UserRole,
    nullable: false,
    comment: '채팅방 생성자 타입',
  })
  operatorType: UserRole;

  @Column({
    name: 'alive',
    type: 'boolean',
    nullable: false,
    comment: '채팅방 활성화 여부',
  })
  alive: boolean;

  @Column({
    name: 'deactivation_scheduled_at',
    type: 'datetime',
    nullable: true,
    comment: '채팅방 비활성화 예약 시간',
  })
  deactivationScheduledAt: Date | null;

  @Column({
    name: 'deactivation_reason',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '채팅방 비활성화 예약 사유',
  })
  deactivationReason: string | null;

  @Column({
    name: 'last_message_at',
    type: 'datetime',
    nullable: true,
    comment: '마지막 메시지 시간',
  })
  lastMessageAt: Date | null;

  @Column({
    name: 'last_message',
    type: 'text',
    nullable: true,
    comment: '마지막 메시지',
  })
  lastMessage: string | null;

  @Column({
    name: 'last_message_by',
    type: 'enum',
    enum: UserRole,
    nullable: true,
    comment: '마지막 메시지 보낸 사람',
  })
  lastMessageBy: UserRole | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    nullable: false,
    comment: '생성일',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
    nullable: false,
    comment: '수정일',
  })
  updatedAt: Date;

  // relations
  @OneToMany(() => ChatRoomMembers, (chatRoomMember) => chatRoomMember.chatRoom)
  chatRoomMembers: ChatRoomMembers[];

  @OneToMany(() => ChatMessages, (chatMessage) => chatMessage.chatRoom)
  chatMessages: ChatMessages[];

  // static methods
  static create(params: {
    chatRoomType: ChatRoomType;
    chatRoomRelatedId: string;
    operatorType: UserRole;
    operatorId: string;
  }): ChatRooms {
    const chatRoom = new ChatRooms();
    chatRoom.chatRoomType = params.chatRoomType;
    chatRoom.chatRoomRelatedId = params.chatRoomRelatedId;
    chatRoom.operatorType = params.operatorType;
    chatRoom.operatorId = params.operatorId;
    chatRoom.alive = true;
    chatRoom.lastMessageAt = null;
    chatRoom.lastMessage = null;
    chatRoom.lastMessageBy = null;
    chatRoom.createdAt = new Date();
    chatRoom.updatedAt = new Date();

    return chatRoom;
  }
}
