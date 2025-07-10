import { NotFoundException } from '@nestjs/common';

export class ChatRoomNotAliveException extends NotFoundException {
  constructor(chatRoomId: string, userId?: string) {
    const userInfo = userId ? ` for user: ${userId}` : '';
    super(
      `[ChatRoomNotAliveException] Chat room not alive: ${chatRoomId}${userInfo}`,
    );
  }
}
