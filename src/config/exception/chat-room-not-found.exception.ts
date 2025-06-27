import { NotFoundException } from '@nestjs/common';

export class ChatRoomNotFoundException extends NotFoundException {
  constructor(chatRoomId: string, userId?: string) {
    const userInfo = userId ? ` for user: ${userId}` : '';
    super(
      `[ChatRoomNotFoundException] Chat room not found: ${chatRoomId}${userInfo}`,
    );
  }
}
