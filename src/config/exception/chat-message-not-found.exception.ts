import { NotFoundException } from '@nestjs/common';

export class ChatMessageNotFoundException extends NotFoundException {
  constructor(messageId: string, chatRoomId?: string) {
    const chatRoomInfo = chatRoomId ? ` in chat room: ${chatRoomId}` : '';
    super(
      `[ChatMessageNotFoundException] Chat message not found: ${messageId}${chatRoomInfo}`,
    );
  }
}
