import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChatRooms } from './entity/ChatRooms.entity';
import { ChatMessages } from './entity/ChatMessages.entity';
import { ChatRoomMembers } from './entity/ChatRoomMembers.entity';
import { ChatTemplates } from './entity/ChatTemplates.entity';
import { ChatConnectedUsers } from './entity/ChatConnectedUsers.entity';

import { ChatRoomRepository } from './repository/chat-room.repository';
import { ChatRoomMemberRepository } from './repository/chat-room-member.repository';
import { ChatMessageRepository } from './repository/chat-message.repository';
import { ChatTemplateRepository } from './repository/chat-templates.repository';
import { ChatConnectionRepository } from './repository/chat-connection.repository';
import { ChatService } from './servcie/chat.service';
import { SocketEmitService } from './servcie/socket-emit.service';

import { ChatGateway } from './chat.gateway';
import { AuthModule } from '../auth/auth.module';
import { LogModule } from '../../config/log/log.module';
import { UserModule } from '../user/user.module';
import { FileModule } from '../file/file.module';

import { SocketHelperController } from './socket-helper.controller';

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
    forwardRef(() => FileModule),
  ],
  providers: [
    ChatGateway,
    ChatService,
    ChatRoomRepository,
    ChatRoomMemberRepository,
    ChatMessageRepository,
    ChatTemplateRepository,
    ChatConnectionRepository,
    SocketEmitService,
  ],
  controllers: [SocketHelperController],
  exports: [
    ChatService,
    ChatRoomMemberRepository,
    ChatMessageRepository,
    SocketEmitService,
  ],
})
export class ChatModule {}
