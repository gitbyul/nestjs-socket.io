/* eslint-disable */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import * as _ from 'lodash';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { LogUtil } from './log.util';

@Injectable()
export class LogHttpInterceptor implements NestInterceptor {
  constructor(private readonly logger: LogUtil) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const { method, url, body, query } = context.switchToHttp().getRequest();
    const className = context.getClass().name;
    const handlerName = context.getHandler().name;
    const now = new Date();

    const logParam = { query: '', body: '' };
    logParam.query = _.cloneDeep(query);
    logParam.body = _.cloneDeep(body);

    this.logger.info(
      `[Request][${method}][${url}][${className}][${handlerName}]=>${JSON.stringify(logParam)}`,
    );

    return next.handle().pipe(
      tap((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;
        const delay = Date.now() - now.getTime();

        this.logger.info(
          `[Response][${method}][${url}][${className}][${handlerName}][${statusCode}][${delay}ms]=>${JSON.stringify(data)}`,
        );
      }),
      catchError((error) => {
        const delay = Date.now() - now.getTime();
        const statusCode = error.getStatus ? error.getStatus() : 500;
        const errorMessage = error.message || 'Internal server error';
        const errorResponse = error.response
          ? JSON.stringify(error.response)
          : '';
        this.logger.error(
          `[Error][${method}][${url}][${className}][${handlerName}][${statusCode}][${delay}ms]=>[${errorMessage}] : ${errorResponse}`,
        );
        return throwError(() => error);
      }),
    );
  }
}
