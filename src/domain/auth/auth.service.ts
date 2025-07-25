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
    const token = this.extractWebSocketJwtToken(socket);

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
   * 웹소켓 연결 시 토큰 추출
   * @param socket
   * @returns <token>
   */
  private extractWebSocketJwtToken(socket: Socket) {
    const authToken = this.extractWebSocketJwtTokenWithAuth(socket);
    const headerToken = this.extractWebSocketJwtTokenWithHeader(socket);
    const queryToken = this.extractWebSocketJwtTokenWithQuery(socket);

    if (!authToken && !headerToken && !queryToken)
      throw new UnauthorizedException('Not found token');

    const jwt = authToken || headerToken || queryToken;

    const [bearer, token] = jwt.split(' ');
    if (bearer !== 'Bearer' || !token)
      throw new UnauthorizedException('Invalid or missing token');

    return token;
  }

  /**
   * 웹소켓 연결 시 토큰 추출 (auth)
   * @param socket
   * @returns Bearer <token>
   */
  private extractWebSocketJwtTokenWithAuth(socket: Socket) {
    return socket.handshake.auth.token as string;
  }

  /**
   * 웹소켓 연결 시 토큰 추출 (header)
   * @param socket
   * @returns Bearer <token>
   */
  private extractWebSocketJwtTokenWithHeader(socket: Socket) {
    return socket.handshake.headers.authorization;
  }

  /**
   * 웹소켓 연결 시 토큰 추출 (query)
   * @param socket
   * @returns Bearer <token>
   */
  private extractWebSocketJwtTokenWithQuery(socket: Socket) {
    return socket.handshake.query.token as string;
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
