import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { EnvValidationModule } from './config/env/env.module';

@Module({
  imports: [EnvValidationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
