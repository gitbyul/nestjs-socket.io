import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { EnvValidationModule } from './config/env/env.module';
import { MySqlModule } from './config/db/mysql.module';
import { LogModule } from './config/log/log.module';
import { AuthModule } from './domain/auth/auth.module';
import { ChatModule } from './domain/chat/chat.module';
import { FileModule } from './domain/file/file.module';
import { ResponseInterceptor } from './config/interceptor/response.intercepetor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventModule } from './domain/event/event.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
    }),
    EnvValidationModule,
    MySqlModule,
    LogModule,
    AuthModule,
    ChatModule,
    FileModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
