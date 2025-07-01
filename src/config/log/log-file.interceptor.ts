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
export class LogFileInterceptor implements NestInterceptor {
  constructor(private readonly logger: LogUtil) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, files, file } = request;
    const className = context.getClass().name;
    const handlerName = context.getHandler().name;
    const now = new Date();

    const logParam: {
      query: any;
      body: any;
      file: any;
      files: any;
    } = {
      query: {},
      body: {},
      file: {},
      files: [],
    };
    logParam.query = _.cloneDeep(query);
    logParam.body = _.cloneDeep(body);
    logParam.file = this.extractFileInfo(file);
    logParam.files = this.extractFileInfo(files);

    this.logger.info(
      `[HTTP][FILE][Request][${method}][${url}][${className}][${handlerName}]=>${JSON.stringify(logParam)}`,
    );

    return next.handle().pipe(
      tap((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;
        const delay = Date.now() - now.getTime();

        this.logger.info(
          `[HTTP][FILE][Response][${method}][${url}][${className}][${handlerName}][${statusCode}][${delay}ms]=>${JSON.stringify(data)}`,
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
          `[HTTP][FILE][Error][${method}][${url}][${className}][${handlerName}][${statusCode}][${delay}ms]=>[${errorMessage}] : ${errorResponse}`,
        );
        return throwError(() => error);
      }),
    );
  }

  private extractFileInfo(
    fileInfo: Express.Multer.File | Express.Multer.File[],
  ) {
    if (!fileInfo) {
      return null;
    }

    if (Array.isArray(fileInfo)) {
      return fileInfo.map((file) => ({
        fieldname: file.fieldname,
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        size: file.size,
      }));
    }

    return {
      fieldname: fileInfo.fieldname,
      originalname: fileInfo.originalname,
      encoding: fileInfo.encoding,
      mimetype: fileInfo.mimetype,
      size: fileInfo.size,
    };
  }
}
