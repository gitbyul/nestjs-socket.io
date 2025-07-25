import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { Request } from 'express';

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

  /**
   * Http 요청 시 토큰 검증
   * @param request
   * @returns UserPayload
   */
  async authenticateHttp(request: Request) {
    const token = this.extractHttpJwtToken(request);
    const payload = await this.verifyToken(token);
    if (!this.isAccessToken(payload)) {
      throw new UnauthorizedException('Invalid token');
    }
    return payload;
  }

  /**
   * 웹소켓 연결 시 토큰 검증
   * @param socket
   * @returns UserPayload
   */
  async authenticateSocket(socket: Socket) {
    const token = this.extractWebSocketJwtTokenWithQuery(socket);
    const payload = await this.verifyToken(token);
    if (!this.isAccessToken(payload)) {
      throw new UnauthorizedException('Invalid token');
    }
    return payload;
  }

  /**
   * 헤더 토큰 추출
   * @param request
   * @returns string
   */
  private extractHttpJwtToken(request: Request) {
    const authHeader = request.headers.authorization;
    if (!authHeader)
      throw new UnauthorizedException('No authorization header found');

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token)
      throw new UnauthorizedException('Invalid or missing token');

    return token;
  }

  /**
   * 웹소켓 연결 시 토큰 추출 (header)
   * @param socket
   * @returns string
   * @deprecated header 토큰 추출 로직 사용 안함
   */
  private extractWebSocketJwtTokenWithHeader(socket: Socket) {
    const authHeader = socket.handshake.headers.authorization;
    if (!authHeader)
      throw new UnauthorizedException('No authorization header found');

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token)
      throw new UnauthorizedException('Invalid or missing token');

    return token;
  }

  /**
   * 웹소켓 연결 시 토큰 추출 (query)
   * @param socket
   * @returns string
   */
  private extractWebSocketJwtTokenWithQuery(socket: Socket) {
    const tokenQuery = socket.handshake.query.token as string;
    if (!tokenQuery)
      throw new UnauthorizedException('Invalid or missing token');

    const [bearer, token] = tokenQuery.split(' ');
    if (bearer !== 'Bearer' || !token)
      throw new UnauthorizedException('Invalid or missing token');

    return token;
  }

  /**
   * 토큰 검증
   * @param token
   * @returns UserPayload
   */
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

  /**
   * 토큰 타입 검증
   * @param payload
   * @returns boolean
   */
  private isAccessToken(payload: UserPayload) {
    return payload.tokenType === TokenType.ACCESS;
  }
}
