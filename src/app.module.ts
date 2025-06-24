import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { EnvValidationModule } from './config/env/env.module';
import { MySqlModule } from './config/db/mysql.module';
import { AuthModule } from './domain/auth/auth.module';

@Module({
  imports: [EnvValidationModule, MySqlModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
