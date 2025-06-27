import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
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

import { ValidationEntity } from 'src/config/entity/Validation.entity';

@Entity({ name: 'chat_connected_users' })
export class ChatConnectedUsers extends ValidationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  @Column({ name: 'role', type: 'varchar', comment: '유저 타입' })
  role: UserRole;

  @IsUUID()
  @IsNotEmpty()
  @Column({
    name: 'user_id',
    type: 'uuid',
    nullable: false,
    comment: '유저 아이디',
  })
  userId: string;

  @IsString()
  @IsNotEmpty()
  @Column({
    name: 'socket_id',
    type: 'varchar',
    nullable: true,
    comment: '소켓 아이디',
  })
  socketId: string | null;

  @IsBoolean()
  @IsNotEmpty()
  @Column({ name: 'alive', type: 'boolean', comment: '활성화 여부' })
  alive: boolean;

  @IsDate()
  @IsNotEmpty()
  @Column({
    name: 'login_at',
    type: 'datetime',
    nullable: false,
    comment: '로그인 시간',
  })
  loginAt: Date;

  @IsDate()
  @IsOptional()
  @Column({
    name: 'logout_at',
    type: 'datetime',
    nullable: true,
    comment: '로그아웃 시간',
  })
  logoutAt: Date | null;

  @IsDate()
  @IsOptional()
  @Column({
    name: 'last_activity_at',
    type: 'datetime',
    nullable: true,
    comment: '마지막 활동 시간',
  })
  lastActivityAt: Date | null;

  static newConnectedUser(params: {
    userId: string;
    role: UserRole;
    socketId: string;
  }) {
    const connectedUser = new ChatConnectedUsers();
    connectedUser.userId = params.userId;
    connectedUser.role = params.role;
    connectedUser.socketId = params.socketId;
    connectedUser.alive = true;
    connectedUser.loginAt = new Date();
    connectedUser.lastActivityAt = new Date();
    return connectedUser;
  }
}
