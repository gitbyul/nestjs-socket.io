import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enums/user-role.enum';
import { RBAC } from '../decorator/rbac.decorator';
import { AuthRequest } from '../interface/auth-request.interface';
import { UserPayload } from 'src/config/type/user-payload.type';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // RBAC Annotation 가져오기
    const requiredRoles = this.reflector.getAllAndOverride<UserRole>(RBAC, [
      context.getHandler(),
      context.getClass(),
    ]);

    // RBAC Annotation 없을 경우 통과
    if (!requiredRoles) {
      return true;
    }

    // 사용자 정보 가져오기
    const request: AuthRequest = context.switchToHttp().getRequest();
    const user: UserPayload = request.user;
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    // 사용자 권한 확인
    const userRole = user.role;
    if (!requiredRoles.includes(userRole)) {
      throw new ForbiddenException('Forbidden');
    }

    // 권한 통과
    return true;
  }
}
