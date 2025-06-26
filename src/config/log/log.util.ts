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
}
