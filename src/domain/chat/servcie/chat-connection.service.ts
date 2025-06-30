import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ChatConnectedUsers } from '../entity/ChatConnectedUsers.entity';
import { UserRole } from 'src/domain/auth/enums/user-role.enum';

@Injectable()
export class ChatConnectionService {
  constructor(
    @InjectRepository(ChatConnectedUsers)
    private chatConnectedUsersRepository: Repository<ChatConnectedUsers>,
  ) {}

  /**
   * 연결 성공
   * @param userId 유저 ID
   * @param role 유저 역할
   * @param socketId 소켓 ID
   */
  async connection(userId: string, role: UserRole, socketId: string) {
    const existingUser = await this.chatConnectedUsersRepository.exists({
      where: { userId, alive: true },
    });
    if (existingUser) {
      await this.chatConnectedUsersRepository.update(
        { userId },
        { socketId, alive: true, loginAt: new Date() },
      );
    } else {
      const connectedUser = ChatConnectedUsers.newConnectedUser({
        userId,
        role,
        socketId,
      });
      await this.chatConnectedUsersRepository.insert(connectedUser);
    }
  }

  /**
   * 연결 해제
   * @param userId 유저 ID
   * @param socketId 소켓 ID
   */
  async disconnect(userId: string, socketId: string) {
    await this.chatConnectedUsersRepository.update(
      { userId, socketId },
      { alive: false, logoutAt: new Date(), lastActivityAt: new Date() },
    );
  }
}
