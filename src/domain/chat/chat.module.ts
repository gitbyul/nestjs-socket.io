import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChatRoomService } from './servcie/chat-room.service';
import { ChatRoomMemberService } from './servcie/chat-room-member.service';
import { ChatMessageService } from './servcie/chat-message.service';
import { ChatTemplateService } from './servcie/chat-templates.service';
import { ChatService } from './servcie/chat.service';
import { EventEmitService } from './servcie/event-emit.service';

import { ChatGateway } from './chat.gateway';
import { AuthModule } from '../auth/auth.module';
import { LogModule } from '../../config/log/log.module';
import { UserModule } from '../user/user.module';

import { ChatRooms } from './entity/ChatRooms.entity';
import { ChatMessages } from './entity/ChatMessages.entity';
import { ChatRoomMembers } from './entity/ChatRoomMembers.entity';
import { ChatTemplates } from './entity/ChatTemplates.entity';
import { ChatConnectedUsers } from './entity/ChatConnectedUsers.entity';
import { ChatConnectionService } from './servcie/chat-connection.service';

@Module({
  imports: [
    AuthModule,
    LogModule,
    TypeOrmModule.forFeature([
      ChatRooms,
      ChatMessages,
      ChatRoomMembers,
      ChatTemplates,
      ChatConnectedUsers,
    ]),
    UserModule,
  ],
  providers: [
    ChatGateway,
    ChatService,
    ChatRoomService,
    ChatRoomMemberService,
    ChatMessageService,
    ChatTemplateService,
    ChatConnectionService,
    EventEmitService,
  ],
})
export class ChatModule {}
