import { NotFoundException } from '@nestjs/common';

export class ChatRoomMemberNotFoundException extends NotFoundException {
  constructor(chatRoomId: string, memberId: string) {
    super(
      `[ChatRoomMemberNotFoundException] Chat room member not found: ${chatRoomId} for member: ${memberId}`,
    );
  }
}
