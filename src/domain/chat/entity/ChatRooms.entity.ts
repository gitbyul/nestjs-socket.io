import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { UserRole } from 'src/domain/auth/enums/user-role.enum';
import { ChatRoomType } from 'src/domain/chat/enums/chat-room-type.enums';

import { ValidationEntity } from 'src/config/entity/Validation.entity';
import { ChatRoomMembers } from './ChatRoomMembers.entity';
import { ChatMessages } from './ChatMessages.entity';

@Entity({ name: 'chat_rooms' })
export class ChatRooms extends ValidationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsEnum(ChatRoomType)
  @IsNotEmpty()
  @Column({
    name: 'chat_room_type',
    type: 'enum',
    enum: ChatRoomType,
    nullable: false,
    comment: '채팅방 타입',
  })
  chatRoomType: ChatRoomType;

  @IsUUID()
  @IsNotEmpty()
  @Column({
    name: 'chat_room_related_id',
    type: 'uuid',
    nullable: false,
    comment: '채팅방 연관 ID',
  })
  chatRoomRelatedId: string;

  @IsUUID()
  @IsNotEmpty()
  @Column({
    name: 'operator_id',
    type: 'uuid',
    nullable: false,
    comment: '채팅방 생성자 ID',
  })
  operatorId: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  @Column({
    name: 'operator_type',
    type: 'enum',
    enum: UserRole,
    nullable: false,
    comment: '채팅방 생성자 타입',
  })
  operatorType: UserRole;

  @IsBoolean()
  @IsNotEmpty()
  @Column({
    name: 'alive',
    type: 'boolean',
    nullable: false,
    comment: '채팅방 활성화 여부',
  })
  alive: boolean;

  @IsDate()
  @IsOptional()
  @Column({
    name: 'deactivation_scheduled_at',
    type: 'datetime',
    nullable: true,
    comment: '채팅방 비활성화 예약 시간',
  })
  deactivationScheduledAt: Date | null;

  @IsString()
  @IsOptional()
  @Column({
    name: 'deactivation_reason',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '채팅방 비활성화 예약 사유',
  })
  deactivationReason: string | null;

  @IsDate()
  @IsOptional()
  @Column({
    name: 'last_message_at',
    type: 'datetime',
    nullable: true,
    comment: '마지막 메시지 시간',
  })
  lastMessageAt: Date | null;

  @IsString()
  @IsOptional()
  @Column({
    name: 'last_message',
    type: 'text',
    nullable: true,
    comment: '마지막 메시지',
  })
  lastMessage: string | null;

  @IsEnum(UserRole)
  @IsOptional()
  @Column({
    name: 'last_message_by_role',
    type: 'enum',
    enum: UserRole,
    nullable: true,
    comment: '마지막 메시지 보낸 사람',
  })
  lastMessageByRole: UserRole | null;

  @IsUUID()
  @IsOptional()
  @Column({
    name: 'last_message_by_id',
    type: 'uuid',
    nullable: true,
    comment: '마지막 메시지 보낸 사람',
  })
  lastMessageById: string | null;

  @IsDate()
  @IsNotEmpty()
  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    nullable: false,
    comment: '생성일',
  })
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
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
}
