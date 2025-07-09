import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChatRooms } from './entity/ChatRooms.entity';
import { ChatMessages } from './entity/ChatMessages.entity';
import { ChatRoomMembers } from './entity/ChatRoomMembers.entity';
import { ChatConnectedUsers } from './entity/ChatConnectedUsers.entity';

import { ChatRoomRepository } from './repository/chat-room.repository';
import { ChatRoomMemberRepository } from './repository/chat-room-member.repository';
import { ChatMessageRepository } from './repository/chat-message.repository';
import { ChatConnectionRepository } from './repository/chat-connection.repository';
import { ChatService } from './servcie/chat.service';
import { SocketEmitService } from './servcie/socket-emit.service';

import { ChatGateway } from './chat.gateway';
import { AuthModule } from '../auth/auth.module';
import { LogModule } from '../../config/log/log.module';
import { UserModule } from '../user/user.module';
import { FileModule } from '../file/file.module';

import { SocketHelperController } from './socket-helper.controller';
import { AdProposalsModule } from '../adproposals/adproposals.module';
import { ChatTemplates } from './entity/ChatTemplates.entity';
import { ChatTemplateRepository } from './repository/chat-templates.repository';
import { ChatTemplateService } from './servcie/chat-template.service';

@Module({
  imports: [
    AuthModule,
    LogModule,
    TypeOrmModule.forFeature([
      ChatRooms,
      ChatMessages,
      ChatRoomMembers,
      ChatConnectedUsers,
      ChatTemplates,
    ]),
    UserModule,
    AdProposalsModule,
    forwardRef(() => FileModule),
  ],
  providers: [
    ChatGateway,
    ChatService,
    SocketEmitService,
    ChatTemplateService,
    ChatRoomRepository,
    ChatRoomMemberRepository,
    ChatMessageRepository,
    ChatConnectionRepository,
    ChatTemplateRepository,
  ],
  controllers: [SocketHelperController],
  exports: [
    ChatService,
    ChatRoomRepository,
    ChatRoomMemberRepository,
    ChatMessageRepository,
    ChatTemplateRepository,
    ChatTemplateService,
    SocketEmitService,
  ],
})
export class ChatModule {}
