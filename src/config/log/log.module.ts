import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import * as nestWinston from 'nest-winston';
import { WinstonModule } from 'nest-winston';
import * as path from 'path';
import * as winston from 'winston';
import * as winstonDailyRotateFile from 'winston-daily-rotate-file';
import { LogInterceptor } from './log.interceptor';
import { LogUtil } from './log.util';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: 'debug',
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:SSS' }),
            nestWinston.utilities.format.nestLike('API', {
              prettyPrint: true,
            }),
          ),
        }),
        new winstonDailyRotateFile({
          level: 'debug',
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:SSS' }),
            nestWinston.utilities.format.nestLike('API'),
          ),
          datePattern: 'YYYY-MM-DD',
          dirname:
            process.env.NODE_ENV === 'local'
              ? path.join(process.cwd(), 'log')
              : '/root/node/apiLog',
          filename: '%DATE%_api.log',
          maxFiles: '14d',
          zippedArchive: true,
        }),
      ],
    }),
  ],
  providers: [{ provide: APP_INTERCEPTOR, useClass: LogInterceptor }, LogUtil],
  exports: [LogUtil],
})
export class LogModule {}
