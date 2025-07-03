import { Module } from '@nestjs/common';
import * as nestWinston from 'nest-winston';
import { WinstonModule } from 'nest-winston';
import * as path from 'path';
import * as winston from 'winston';
import * as winstonDailyRotateFile from 'winston-daily-rotate-file';
import { LogHttpInterceptor } from './log-http.interceptor';
import { LogWebSocketInterceptor } from './log-ws.interceptor';
import { LogUtil } from './log.util';
import { LogFileInterceptor } from './log-file.interceptor';

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
            winston.format.printf((info) => {
              const { timestamp, level, message, context } = info as any;
              const contextStr = context ? `[${context}] ` : '';
              return `[API] ${process.pid} ${timestamp} ${level.toUpperCase().padEnd(7)} ${contextStr}${message}`;
            }),
          ),
          datePattern: 'YYYY-MM-DD',
          dirname:
            process.env.ENV === 'dev'
              ? path.join(process.cwd(), 'log', 'dev')
              : path.join(process.cwd(), 'log', 'prod'),
          filename: '%DATE%_api.log',
          maxFiles: '14d',
          zippedArchive: true,
        }),
      ],
    }),
  ],
  providers: [
    LogUtil,
    LogHttpInterceptor,
    LogWebSocketInterceptor,
    LogFileInterceptor,
  ],
  exports: [
    LogUtil,
    LogHttpInterceptor,
    LogWebSocketInterceptor,
    LogFileInterceptor,
  ],
})
export class LogModule {}
