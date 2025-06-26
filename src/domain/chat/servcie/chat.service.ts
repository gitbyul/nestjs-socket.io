import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

import { UserPayload } from 'src/config/type/user-payload.type';
import { AuthenticatedSocket } from 'src/config/type/socket.types';

import { ChatRoomService } from './chat-room.service';
import { ChatMessageService } from './chat-message.service';
import { ChatTemplateService } from './chat-templates.service';
import { ChatRoomMemberService } from './chat-room-member.service';
import { ChatConnectionService } from './chat-connection.service';

@Injectable()
export class ChatService {
  private readonly connectedUsers: Map<string, AuthenticatedSocket> = new Map();
  constructor(
    private readonly chatRoomService: ChatRoomService,
    private readonly chatRoomMemberService: ChatRoomMemberService,
    private readonly chatMessageService: ChatMessageService,
    private readonly chatTemplateService: ChatTemplateService,
    private readonly chatConnectionService: ChatConnectionService,
  ) {}

  async initializeUserConnection(userPayload: UserPayload, socket: Socket) {
    const authenticatedSocket = socket as AuthenticatedSocket;
    authenticatedSocket.data.user = userPayload;
    this.connectedUsers.set(userPayload.id, authenticatedSocket);

    await this.chatConnectionService.connection(
      userPayload.id,
      userPayload.role,
      socket.id,
    );
  }

  async disconnectUser(socket: Socket) {
    await this.chatConnectionService.disconnect(socket.id);
    socket.disconnect();
  }
}
