import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { EMPTY, Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { VALIDATE_DTO_KEY } from 'src/config/decorator/validate-dto.decorator';
import { HandlerEventMap } from '../type/handler-event.map';
import { EventMappingUtil } from '../util/event-mapping.util';
import { SocketEmitService } from '../servcie/socket-emit.service';
import { LogUtil } from 'src/config/log/log.util';

@Injectable()
export class DtoValidationInterceptor implements NestInterceptor {
  constructor(
    private readonly logUtil: LogUtil,
    private readonly socketEmitService: SocketEmitService,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const data = context.switchToWs().getData();
    const socket = context.switchToWs().getClient<Socket>();

    const handler = context.getHandler();
    const dtoClass = Reflect.getMetadata(VALIDATE_DTO_KEY, handler);

    if (!dtoClass) {
      return next.handle();
    }

    try {
      const dto = plainToInstance(dtoClass, data);
      const errors = await validate(dto);

      if (errors.length > 0) {
        const validationErrors = errors.map((e) => {
          const constraints = Object.values(e.constraints ?? {});
          const property = e.property;
          return { property, constraints };
        });

        this.handleValidationFailed(socket, handler.name, validationErrors);
        return EMPTY;
      }
    } catch (error) {
      this.logUtil.error(
        `[DtoValidationInterceptor] intercept: ${error} ${socket.id}`,
      );
      return EMPTY;
    }
    return next.handle();
  }

  private handleValidationFailed(
    socket: Socket,
    handlerName: string,
    validationErrors: any,
  ) {
    const eventName = EventMappingUtil.getFailureEventByHandler(
      handlerName as keyof HandlerEventMap,
    );

    this.logUtil.error(
      `[DtoValidationInterceptor][${handlerName}][${eventName}] Validation failed for socket ${socket.id}`,
    );

    this.socketEmitService.validationFailed(
      socket,
      eventName,
      validationErrors,
    );

    return EMPTY;
  }
}
