import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { EnvValidationModule } from './config/env/env.module';
import { MySqlModule } from './config/db/mysql.module';
import { AuthModule } from './domain/auth/auth.module';
import { ChatModule } from './domain/chat/chat.module';

@Module({
  imports: [EnvValidationModule, MySqlModule, AuthModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
