import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateChatRoomMemberLastReadMessageDto {
  @IsUUID(4)
  @IsNotEmpty({ message: '채팅방 ID는 필수 입력 항목입니다.' })
  chatRoomId: string;

  @IsUUID(4)
  @IsNotEmpty({ message: '보낸 사람 ID는 필수 입력 항목입니다.' })
  memberId: string;

  @IsUUID(4)
  @IsNotEmpty({ message: '메시지는 필수 입력 항목입니다.' })
  lastReadMessageId: string;
}
