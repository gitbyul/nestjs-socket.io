import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { EMPTY, Observable } from 'rxjs';
import { EventEmitService } from '../servcie/event-emit.service';
import { Socket } from 'socket.io';
import { ChatService } from '../servcie/chat.service';
import { LogUtil } from 'src/config/log/log.util';
import { EventMappingUtil } from '../util/event-mapping.util';
import { HandlerEventMap } from '../type/handler-event.map';

@Injectable()
export class UserValidationInterceptor implements NestInterceptor {
  constructor(
    private readonly logUtil: LogUtil,
    private readonly chatService: ChatService,
    private readonly eventEmitService: EventEmitService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const socket = context.switchToWs().getClient<Socket>();
    const handler = context.getHandler();

    // 유저 존재 여부 확인 [메모리]
    const userId = this.chatService.getUserIdBySocketId(socket.id);
    if (!userId) {
      return this.handleUserNotFoundError(socket, handler.name);
    }

    // 유저 연결 상태 확인 [메모리]
    const connectionInfo = this.chatService.getUserConnectionInfo(userId);
    if (!connectionInfo) {
      return this.handleUserNotFoundError(socket, handler.name);
    }
    socket.data.userId = userId;
    socket.data.userRole = connectionInfo.userRole;
    return next.handle();
  }

  private handleUserNotFoundError(socket: Socket, handlerName: string) {
    // 이벤트 매핑
    const eventName = EventMappingUtil.getFailureEventByHandler(
      handlerName as keyof HandlerEventMap,
    );

    this.logUtil.error(
      `[UserValidationInterceptor][${handlerName}][${eventName}] User not found for socket ${socket.id}`,
    );

    this.eventEmitService.userNotFound(
      socket,
      eventName,
      `User not found for socket ${socket.id}`,
    );

    return EMPTY;
  }
}
