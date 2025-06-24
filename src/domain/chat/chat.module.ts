import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChatRoomService } from './servcie/chat-room.service';
import { ChatRoomMemberService } from './servcie/chat-room-member.service';
import { ChatMessageService } from './servcie/chat-message.service';
import { ChatTemplateService } from './servcie/chat-templates.service';
import { ChatService } from './servcie/chat.service';

import { ChatGateway } from './chat.gateway';
import { AuthModule } from 'src/domain/auth/auth.module';

import { ChatRooms } from './entity/ChatRooms.entity';
import { ChatMessages } from './entity/ChatMessages.entity';
import { ChatRoomMembers } from './entity/ChatRoomMembers.entity';
import { ChatTemplates } from './entity/ChatTemplates.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      ChatRooms,
      ChatMessages,
      ChatRoomMembers,
      ChatTemplates,
    ]),
  ],
  providers: [
    ChatGateway,
    ChatService,
    ChatRoomService,
    ChatRoomMemberService,
    ChatMessageService,
    ChatTemplateService,
  ],
})
export class ChatModule {}
