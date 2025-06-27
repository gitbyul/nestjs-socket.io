import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import * as _ from 'lodash';
import { Observable, tap, catchError } from 'rxjs';
import { LogUtil } from './log.util';
import { Socket } from 'socket.io';

@Injectable()
export class LogWebSocketInterceptor implements NestInterceptor {
  constructor(private readonly logger: LogUtil) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const socket = context.switchToWs().getClient<Socket>();
    const data = context.switchToWs().getData();
    const className = context.getClass().name;
    const handlerName = context.getHandler().name;
    const eventName = context.switchToWs().getPattern();
    const now = new Date();

    // 요청 로그
    const requestLog = {
      socketId: socket.id,
      userId: socket.data?.userId || 'unknown',
      userRole: socket.data?.userRole || 'unknown',
      event: eventName,
      data: _.cloneDeep(data),
    };

    this.logger.info(
      `[WebSocket][Request][${className}][${handlerName}][${eventName}][${socket.id}][${socket.data?.userId || 'unknown'}]=>${JSON.stringify(requestLog)}`,
    );

    return next.handle().pipe(
      tap((responseData) => {
        const delay = Date.now() - now.getTime();
        const responseLog = {
          socketId: socket.id,
          userId: socket.data?.userId || 'unknown',
          event: eventName,
          response: _.cloneDeep(responseData),
          delay: `${delay}ms`,
        };

        this.logger.info(
          `[WebSocket][Response][${className}][${handlerName}][${eventName}][${socket.id}][${socket.data?.userId || 'unknown'}][${delay}ms]=>${JSON.stringify(responseLog)}`,
        );
      }),
      catchError((error) => {
        const delay = Date.now() - now.getTime();
        const errorLog = {
          socketId: socket.id,
          userId: socket.data?.userId || 'unknown',
          event: eventName,
          error: error.message || 'Unknown error',
          stack: error.stack,
          delay: `${delay}ms`,
        };

        this.logger.error(
          `[WebSocket][Error][${className}][${handlerName}][${eventName}][${socket.id}][${socket.data?.userId || 'unknown'}][${delay}ms]=>${JSON.stringify(errorLog)}`,
        );
        throw error;
      }),
    );
  }
}
