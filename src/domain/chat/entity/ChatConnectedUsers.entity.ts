import { UserRole } from 'src/domain/auth/enums/user-role.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'chat_connected_users' })
export class ChatConnectedUsers {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'role', type: 'varchar' })
  role: UserRole;

  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId: string;

  @Column({ name: 'socket_id', type: 'varchar', nullable: true })
  socketId: string | null;

  @Column({ name: 'alive', type: 'boolean' })
  alive: boolean;

  @Column({ name: 'login_at', type: 'datetime', nullable: false })
  loginAt: Date;

  @Column({ name: 'logout_at', type: 'datetime', nullable: true })
  logoutAt: Date | null;

  static create(params: { userId: string; role: UserRole; socketId: string }) {
    const connectedUser = new ChatConnectedUsers();
    connectedUser.userId = params.userId;
    connectedUser.role = params.role;
    connectedUser.socketId = params.socketId;
    connectedUser.alive = true;
    connectedUser.loginAt = new Date();
    return connectedUser;
  }
}
