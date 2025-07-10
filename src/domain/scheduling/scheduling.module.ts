import { Module } from '@nestjs/common';
import { ChatScheduling } from './chat.scheduling';
import { ScheduleModule } from '@nestjs/schedule';
import { ChatModule } from '../chat/chat.module';
import { LogModule } from 'src/config/log/log.module';

@Module({
  imports: [ScheduleModule.forRoot(), ChatModule, LogModule],
  providers: [ChatScheduling],
  controllers: [],
})
export class SchedulingModule {}
