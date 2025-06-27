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
import { EventEmitUtil } from '../util/event-emit.util';
import { EventErrorCode } from '../enums/chat-error-code.enum';

@Injectable()
export class DtoValidationInterceptor implements NestInterceptor {
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

        EventEmitUtil.emitFailed(
          socket,
          eventName,
          EventErrorCode.VALIDATION_ERROR,
          JSON.stringify(validationErrors),
        );

        return EMPTY;
      }
    } catch (error) {
      console.log(error);
    }

    return next.handle();
  }
}
