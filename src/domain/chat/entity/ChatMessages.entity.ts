import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

import { UserRole } from 'src/domain/auth/enums/user-role.enum';
import { ChatMessageType } from 'src/domain/chat/enums/chat-message-type.enum';

import { ValidationEntity } from 'src/config/entity/Validation.entity';
import { ChatRooms } from './ChatRooms.entity';

@Entity({ name: 'chat_messages' })
export class ChatMessages extends ValidationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsUUID()
  @IsNotEmpty()
  @ManyToOne(() => ChatRooms, (chatRoom) => chatRoom.chatMessages, {
    eager: false,
    nullable: false,
  })
  @JoinColumn({ name: 'chat_room_id' })
  chatRoom: ChatRooms;

  @IsUUID()
  @IsOptional()
  @Column({
    name: 'template_id',
    type: 'uuid',
    nullable: true,
    comment: '메시지 템플릿 ID',
  })
  templateId: string | null;

  @IsEnum(ChatMessageType)
  @IsNotEmpty()
  @Column({
    name: 'type',
    type: 'enum',
    enum: ChatMessageType,
    nullable: false,
    comment: '메시지 타입 (text, file)',
  })
  type: ChatMessageType;

  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  @IsNotEmpty()
  @Column({ name: 'message', type: 'text', nullable: true, comment: '메시지' })
  message: string | null;

  @IsEnum(UserRole)
  @IsNotEmpty()
  @Column({
    name: 'sender_type',
    type: 'enum',
    enum: UserRole,
    nullable: false,
    comment: '메시지 보낸 사람 (광고주 또는 작가)',
  })
  senderType: UserRole;

  @IsUUID()
  @IsNotEmpty()
  @Column({
    name: 'sender_id',
    type: 'uuid',
    nullable: false,
    comment: '메시지 보낸 사람 ID',
  })
  senderId: string;

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

  static newMessage(params: {
    chatRoomId: string;
    templateId?: string;
    message: string;
    type: ChatMessageType;
    senderType: UserRole;
    senderId: string;
  }) {
    const entity = new ChatMessages();
    entity.chatRoom = { id: params.chatRoomId } as ChatRooms;
    entity.templateId = params.templateId ?? null;
    entity.message = params.message;
    entity.type = params.type;
    entity.senderType = params.senderType;
    entity.senderId = params.senderId;
    entity.createdAt = new Date();
    entity.updatedAt = new Date();
    return entity;
  }
}
