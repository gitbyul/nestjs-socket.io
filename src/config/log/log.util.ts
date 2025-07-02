import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';

@Injectable()
export class LogUtil {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
  ) {}

  info(text: string) {
    this.logger.info(`${text}`);
  }
  error(text: string) {
    this.logger.error(`${text}`);
  }
  debug(text: string) {
    this.logger.debug(`${text}`);
  }
  system(text: string) {
    this.logger.verbose(`${text}`);
  }

  // TODO: 해당 로그로 모두 변경 필요
  WebSocketSuccess(text: string) {
    const { className, handlerName } = this.getClassNameAndHandlerName();
    this.logger.info(
      `[WebSocket][${className}][${handlerName}][Success]${text}`,
    );
  }
  WebSocketError(text: string) {
    const { className, handlerName } = this.getClassNameAndHandlerName();
    this.logger.error(
      `[WebSocket][${className}][${handlerName}][Failed]${text}`,
    );
  }
  HttpInfo(text: string) {
    const { className, handlerName } = this.getClassNameAndHandlerName();
    this.logger.info(`[HTTP][${className}][${handlerName}]${text}`);
  }
  HttpError(text: string) {
    const { className, handlerName } = this.getClassNameAndHandlerName();
    this.logger.error(`[HTTP][${className}][${handlerName}]${text}`);
  }
  EventInfo(text: string) {
    const { className, handlerName } = this.getClassNameAndHandlerName();
    this.logger.info(`[Event][${className}][${handlerName}]${text}`);
  }
  EventError(text: string) {
    const { className, handlerName } = this.getClassNameAndHandlerName();
    this.logger.error(`[Event][${className}][${handlerName}]${text}`);
  }

  // 색상 코드가 제거된 로그 메서드들
  // TODO: 추후 사용 필요성 확인 되면 그때 사용
  infoClean(text: string) {
    this.logger.info(this.removeAnsiColors(text));
  }
  errorClean(text: string) {
    this.logger.error(this.removeAnsiColors(text));
  }
  debugClean(text: string) {
    this.logger.debug(this.removeAnsiColors(text));
  }
  systemClean(text: string) {
    this.logger.verbose(this.removeAnsiColors(text));
  }

  // ANSI 색상 코드를 제거하는 함수
  private removeAnsiColors(text: string): string {
    // ANSI 색상 코드 패턴을 문자열로 처리
    return text.replace(/\[[0-9;]*m/g, '');
  }

  // 호출 스택에서 클래스명과 함수명 추출
  private getClassNameAndHandlerName() {
    const stack = new Error().stack;
    let className = 'unknown';
    let handlerName = 'unknown';

    if (stack) {
      const stackLines = stack.split('\n');
      if (stackLines.length > 2) {
        const match = stackLines[3].match(/at\s+(.*)\s+\((.*)\)/);
        if (match && match[1]) {
          const parts = match[1].split('.');
          className = parts[0];
          handlerName = parts[1];
        }
      }
    }
    return { className, handlerName };
  }
}
