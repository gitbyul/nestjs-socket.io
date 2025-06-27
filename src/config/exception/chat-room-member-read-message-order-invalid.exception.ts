import { NotFoundException } from '@nestjs/common';

export class ChatRoomMemberReadMessageOrderInvalidException extends NotFoundException {
  constructor(
    currentMessageId: string,
    currentMessageCreatedAt: Date,
    previousMessageId: string,
    previousMessageCreatedAt: Date,
    memberId: string,
  ) {
    super(
      `[ChatRoomMemberReadMessageOrderInvalidException] Chat room member read message order invalid: ${JSON.stringify(
        {
          memberId,
          currentMessageId,
          currentMessageCreatedAt,
          previousMessageId,
          previousMessageCreatedAt,
        },
      )}`,
    );
  }
}
