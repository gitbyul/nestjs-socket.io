import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { UserRole } from 'src/domain/auth/enums/user-role.enum';

export class SendFileMessageRequestDto {
  @IsUUID(4)
  @IsNotEmpty({ message: '이벤트 ID는 필수 입력 항목입니다.' })
  eventId: string;

  @IsUUID(4)
  @IsNotEmpty({ message: '채팅방 ID는 필수 입력 항목입니다.' })
  chatRoomId: string;

  @IsUUID(4)
  @IsNotEmpty({ message: '파일 ID는 필수 입력 항목입니다.' })
  fileId: string;

  @IsString()
  @IsNotEmpty({ message: '보내는 사람 ID는 필수 입력 항목입니다.' })
  senderId: string;

  @IsString()
  @IsNotEmpty({ message: '보내는 사람 타입은 필수 입력 항목입니다.' })
  senderType: UserRole;
}
