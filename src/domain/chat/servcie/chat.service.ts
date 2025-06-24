import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

import { ChatRoomService } from './chat-room.service';
import { ChatMessageService } from './chat-message.service';
import { ChatTemplateService } from './chat-templates.service';
import { ChatRoomMemberService } from './chat-room-member.service';

@Injectable()
export class ChatService {
  private readonly connectedUsers: Map<string, Socket> = new Map();
  constructor(
    private readonly chatRoomService: ChatRoomService,
    private readonly chatRoomMemberService: ChatRoomMemberService,
    private readonly chatMessageService: ChatMessageService,
    private readonly chatTemplateService: ChatTemplateService,
  ) {}
}
