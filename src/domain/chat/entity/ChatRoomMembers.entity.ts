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

@Entity({ name: 'chat_room_members' })
export class ChatRoomMembers {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ChatRooms, (chatRoom) => chatRoom.chatRoomMembers, {
    eager: false,
    nullable: false,
  })
  @JoinColumn({ name: 'chat_room_id' })
  chatRoom: ChatRooms;

  @Column({
    name: 'member_type',
    type: 'enum',
    enum: UserRole,
    nullable: false,
    comment: '채팅 참여자 타입',
  })
  memberType: UserRole;

  @Column({
    name: 'member_id',
    type: 'uuid',
    nullable: false,
    comment: '채팅 참여자 ID',
  })
  memberId: string;

  @Column({
    name: 'last_read_message_id',
    type: 'uuid',
    nullable: true,
    comment: '채팅 참여자 마지막 읽은 메시지 ID',
  })
  lastReadMessageId: string | null;

  @Column({
    name: 'last_read_at',
    type: 'datetime',
    nullable: true,
    comment: '채팅 참여자 마지막 읽은 시간',
  })
  lastReadAt: Date | null;

  @Column({
    name: 'alive',
    type: 'boolean',
    nullable: false,
    comment: '채팅 참여자 활성화 여부',
  })
  alive: boolean;

  @CreateDateColumn({
    name: 'joined_at',
    type: 'datetime',
    nullable: false,
    comment: '채팅 참여자 가입 시간',
  })
  joinedAt: Date;

  @UpdateDateColumn({
    name: 'left_at',
    type: 'datetime',
    nullable: true,
    comment: '채팅 참여자 탈퇴 시간',
  })
  leftAt: Date | null;

  static create(params: {
    chatRoom: ChatRooms;
    memberType: UserRole;
    memberId: string;
  }): ChatRoomMembers {
    const chatRoomMember = new ChatRoomMembers();
    chatRoomMember.chatRoom = params.chatRoom;
    chatRoomMember.memberType = params.memberType;
    chatRoomMember.memberId = params.memberId;
    chatRoomMember.lastReadMessageId = null;
    chatRoomMember.lastReadAt = null;
    chatRoomMember.alive = true;
    chatRoomMember.joinedAt = new Date();
    return chatRoomMember;
  }
}
