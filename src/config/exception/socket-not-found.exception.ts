import { NotFoundException } from '@nestjs/common';

export class SocketNotFoundException extends NotFoundException {
  constructor(socketId: string) {
    super(`[SocketNotFoundException] Socket not found: ${socketId}`);
  }
}
