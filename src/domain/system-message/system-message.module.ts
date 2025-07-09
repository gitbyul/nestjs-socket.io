import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { LogModule } from '../../config/log/log.module';
import { UserModule } from '../user/user.module';
import { FileModule } from '../file/file.module';
import { ChatModule } from '../chat/chat.module';
import { AdProposalsModule } from '../adproposals/adproposals.module';

import { SystemMessageService } from './service/system-message.service';
import { SystemMessageController } from './system-message.controller';

@Module({
  imports: [
    AuthModule,
    LogModule,
    UserModule,
    AdProposalsModule,
    ChatModule,
    FileModule,
  ],
  providers: [SystemMessageService],
  controllers: [SystemMessageController],
  exports: [],
})
export class SystemMessageModule {}
