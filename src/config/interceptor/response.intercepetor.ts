import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ResponseEntity } from '../entity/Reponse.entity';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<any> | Promise<Observable<any>> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((result) => {
        if (!(result instanceof ResponseEntity)) {
          return result;
        }

        const { headers, cookie, body } = result;

        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            response.setHeader(key, value);
          });
        }

        if (cookie) {
          Object.entries(cookie).forEach(([key, { val, cookieOptions }]) => {
            response.cookie(key, val, {
              httpOnly: true,
              secure: true,
              sameSite: 'strict',
              maxAge: 24 * 60 * 60 * 1000, // 기본 1일 설정
              ...cookieOptions,
            });
          });
        }

        return {
          statusCode: response.statusCode, // 자동으로 현재 응답 상태 코드 반영
          message: 'Success',
          body,
        };
      }),
    );
  }
}
