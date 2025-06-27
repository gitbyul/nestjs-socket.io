import { NotFoundException } from '@nestjs/common';

export class ChatRoomMemberReadMessageSameIdException extends NotFoundException {
  constructor(
    chatRoomId: string,
    memberId: string,
    currentMessageId: string,
    previousMessageId: string,
  ) {
    super(
      `[ChatRoomMemberReadMessageSameIdException] Chat room member read message same id: ${JSON.stringify(
        {
          chatRoomId,
          memberId,
          currentMessageId,
          previousMessageId,
        },
      )}`,
    );
  }
}
