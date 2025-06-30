import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';

import { UserRole } from 'src/domain/auth/enums/user-role.enum';

import { ValidationEntity } from 'src/config/entity/Validation.entity';
import { ChatRooms } from './ChatRooms.entity';

@Entity({ name: 'chat_room_members' })
export class ChatRoomMembers extends ValidationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsUUID()
  @IsNotEmpty()
  @ManyToOne(() => ChatRooms, (chatRoom) => chatRoom.chatRoomMembers, {
    eager: false,
    nullable: false,
  })
  @JoinColumn({ name: 'chat_room_id' })
  chatRoom: ChatRooms;

  @IsEnum(UserRole)
  @IsNotEmpty()
  @Column({
    name: 'member_type',
    type: 'enum',
    enum: UserRole,
    nullable: false,
    comment: '채팅 참여자 타입',
  })
  memberType: UserRole;

  @IsUUID()
  @IsNotEmpty()
  @Column({
    name: 'member_id',
    type: 'uuid',
    nullable: false,
    comment: '채팅 참여자 ID',
  })
  memberId: string;

  @IsNumber()
  @IsNotEmpty()
  @Column({
    name: 'unread_message_count',
    type: 'int',
    nullable: false,
    comment: '채팅 참여자 읽지 않은 메시지 수',
  })
  unreadMessageCount: number;

  @IsUUID()
  @IsOptional()
  @Column({
    name: 'last_read_message_id',
    type: 'uuid',
    nullable: true,
    comment: '채팅 참여자 마지막 읽은 메시지 ID',
  })
  lastReadMessageId: string | null;

  @IsDate()
  @IsOptional()
  @Column({
    name: 'last_read_at',
    type: 'datetime',
    nullable: true,
    comment: '채팅 참여자 마지막 읽은 시간',
  })
  lastReadAt: Date | null;

  @IsBoolean()
  @IsNotEmpty()
  @Column({
    name: 'alive',
    type: 'boolean',
    nullable: false,
    comment: '채팅 참여자 활성화 여부',
  })
  alive: boolean;

  @IsDate()
  @IsNotEmpty()
  @CreateDateColumn({
    name: 'joined_at',
    type: 'datetime',
    nullable: false,
    comment: '채팅 참여자 가입 시간',
  })
  joinedAt: Date;

  @IsDate()
  @IsOptional()
  @Column({
    name: 'left_at',
    type: 'datetime',
    nullable: true,
    comment: '채팅 참여자 탈퇴 시간',
  })
  leftAt: Date | null;
}
