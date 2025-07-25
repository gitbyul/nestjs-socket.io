import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LogUtil } from 'src/config/log/log.util';

@Injectable()
export class HttpAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: LogUtil,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const user = await this.authService.authenticateHttp(request);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      request.user = user;
      return true;
    } catch (error) {
      this.logger.error(`[AuthGuard][Error] ${error.message}`);
      throw error;
    }
  }
}
