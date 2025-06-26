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

  async connection(userId: string, role: UserRole, socketId: string) {
    const existingUser = await this.chatConnectedUsersRepository.exists({
      where: { userId },
    });
    if (existingUser) {
      await this.chatConnectedUsersRepository.update(
        { userId },
        { socketId, alive: true, loginAt: new Date() },
      );
    } else {
      const connectedUser = ChatConnectedUsers.create({
        userId,
        role,
        socketId,
      });
      await this.chatConnectedUsersRepository.insert(connectedUser);
    }
  }

  async disconnect(socketId: string) {
    await this.chatConnectedUsersRepository.update(
      { socketId },
      { socketId: null, alive: false, logoutAt: new Date() },
    );
  }
}
