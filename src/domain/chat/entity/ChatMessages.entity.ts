import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
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
  ValidateIf,
} from 'class-validator';

import { UserRole } from 'src/domain/auth/enums/user-role.enum';
import { ChatMessageType } from 'src/domain/chat/enums/chat-message-type.enum';

import { ValidationEntity } from 'src/config/entity/Validation.entity';
import { ChatRooms } from './ChatRooms.entity';
import { Files } from 'src/domain/file/entity/Files.entity';
import { SystemMessageDto } from 'src/domain/system-message/dto/system-message.dto';

@Entity({ name: 'chat_messages' })
export class ChatMessages extends ValidationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsNotEmpty()
  @ManyToOne(() => ChatRooms, (chatRoom) => chatRoom.chatMessages, {
    eager: false,
    nullable: false,
  })
  @JoinColumn({ name: 'chat_room_id' })
  chatRoom: ChatRooms;

  @IsEnum(ChatMessageType)
  @IsNotEmpty()
  @Column({
    name: 'type',
    type: 'enum',
    enum: ChatMessageType,
    nullable: false,
    comment: '메시지 타입 (text, file)',
  })
  type: ChatMessageType; // TEXT, FILE, SYSTEM

  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  @ValidateIf((o) => o.type === ChatMessageType.TEXT)
  @IsNotEmpty()
  @Column({ name: 'message', type: 'text', nullable: true, comment: '메시지' })
  message: string | null;

  @IsOptional()
  @Column({
    name: 'system_message',
    type: 'text',
    nullable: true,
    comment: '시스템 메시지',
    transformer: {
      to: (value: SystemMessageDto) => JSON.stringify(value),
      from: (value: string) => JSON.parse(value) as SystemMessageDto | null,
    },
  })
  systemMessage?: SystemMessageDto | null;

  // {
  //   title: string;
  //   content: string;
  //   notice?: {
  //     type: ChatTemplateNoticeType; // NOTICE, WARNING, ALERT
  //     message: string;
  //   };
  //   buttons?: {
  //     btnLocation?: ChatTemplateButtonLocationType; // LEFT, RIGHT
  //     text: string;
  //   }[];
  //   files?: {
  //     originalName: string;
  //     fileId: string;
  //     size: number;
  //   }[];
  //   links?: {
  //     title: string;
  //     url: string;
  //   }[];
  // };

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

  @OneToMany(() => Files, (file) => file.chatMessage)
  files: Files[];

  static newMessage(params: {
    chatRoomId: string;
    message?: string;
    systemMessage?: SystemMessageDto;
    type: ChatMessageType;
    senderType: UserRole;
    senderId: string;
  }) {
    const entity = new ChatMessages();
    entity.chatRoom = { id: params.chatRoomId } as ChatRooms;
    entity.message = params.message ?? null;
    entity.systemMessage = params.systemMessage ?? null;
    entity.type = params.type;
    entity.senderType = params.senderType;
    entity.senderId = params.senderId;
    entity.createdAt = new Date();
    entity.updatedAt = new Date();
    return entity;
  }
}
