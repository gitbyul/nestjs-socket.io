import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ChatRooms } from './ChatRooms.entity';
import { UserRole } from 'src/domain/auth/enums/user-role.enum';
import { ChatMessageType } from 'src/domain/chat/enums/chat-message-type.enum';

@Entity({ name: 'chat_messages' })
export class ChatMessages {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ChatRooms, (chatRoom) => chatRoom.chatMessages, {
    eager: false,
    nullable: false,
  })
  @JoinColumn({ name: 'chat_room_id' })
  chatRoom: ChatRooms;

  @Column({
    name: 'template_id',
    type: 'uuid',
    nullable: true,
    comment: '메시지 템플릿 ID',
  })
  templateId: string | null;

  @Column({
    name: 'type',
    type: 'enum',
    enum: ChatMessageType,
    nullable: false,
    comment: '메시지 타입 (text, file)',
  })
  type: ChatMessageType;

  @Column({ name: 'message', type: 'text', nullable: true, comment: '메시지' })
  message: string | null;

  @Column({
    name: 'sender_type',
    type: 'enum',
    enum: UserRole,
    nullable: false,
    comment: '메시지 보낸 사람 (광고주 또는 작가)',
  })
  senderType: UserRole;

  @Column({
    name: 'sender_id',
    type: 'uuid',
    nullable: false,
    comment: '메시지 보낸 사람 ID',
  })
  senderId: string;

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
}
