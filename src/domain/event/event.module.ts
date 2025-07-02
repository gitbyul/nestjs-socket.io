import { Module } from '@nestjs/common';
import { ChatEventListener } from './listener/chat-event.listener';
import { LogModule } from 'src/config/log/log.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [LogModule, ChatModule],
  providers: [ChatEventListener],
  exports: [ChatEventListener],
})
export class EventModule {}
