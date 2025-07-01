import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { LogUtil } from 'src/config/log/log.util';
import { AuthService } from '../auth.service';

@Injectable()
export class HttpUserValidationInterceptor implements NestInterceptor {
  constructor(
    private readonly logUtil: LogUtil,
    private readonly authService: AuthService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const user = await this.authService.authenticateHttp(request);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    request.user = user;
    return next.handle();
  }
}
