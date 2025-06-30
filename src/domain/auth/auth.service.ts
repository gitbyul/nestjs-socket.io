import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { Socket } from 'socket.io';
import { UserPayload } from 'src/config/type/user-payload.type';
import { TokenType } from './enums/token-type.enum';

@Injectable()
export class AuthService {
  private readonly accessTokenSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenSecret = this.configService.get<string>(
      'ACCESS_TOKEN_SECRET',
    ) as string;
  }

  async authenticateSocket(socket: Socket) {
    const token = this.extractWebSocketJwtToken(socket);
    const payload = await this.verifyToken(token);
    if (!this.isAccessToken(payload)) {
      throw new UnauthorizedException('Invalid token');
    }
    return payload;
  }

  private extractWebSocketJwtToken(socket: Socket) {
    const authHeader = socket.handshake.headers.authorization;
    if (!authHeader)
      throw new UnauthorizedException('No authorization header found');

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token)
      throw new UnauthorizedException('Invalid or missing token');

    return token;
  }

  private async verifyToken(token: string) {
    try {
      return await this.jwtService.verifyAsync<UserPayload>(token, {
        secret: this.accessTokenSecret,
      });
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private isAccessToken(payload: UserPayload) {
    return payload.tokenType === TokenType.ACCESS;
  }
}
