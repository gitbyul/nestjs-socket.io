import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetChatRoomDto {
  @IsUUID(4)
  @IsNotEmpty({ message: '채팅방 ID는 필수 입력 항목입니다.' })
  chatRoomId: string;

  @IsUUID(4)
  @IsNotEmpty({ message: '사용자 ID는 필수 입력 항목입니다.' })
  userId: string;
}
