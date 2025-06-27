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
import { EventEmitService } from '../servcie/event-emit.service';
import { LogUtil } from 'src/config/log/log.util';

@Injectable()
export class DtoValidationInterceptor implements NestInterceptor {
  constructor(
    private readonly logUtil: LogUtil,
    private readonly eventEmitService: EventEmitService,
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
        const eventName = EventMappingUtil.getFailureEventByHandler(
          handler.name as keyof HandlerEventMap,
        );

        const validationErrors = errors.map((e) => {
          const constraints = Object.values(e.constraints ?? {});
          const property = e.property;
          return { property, constraints };
        });

        this.eventEmitService.validationFailed(
          socket,
          eventName,
          validationErrors,
        );

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
}
