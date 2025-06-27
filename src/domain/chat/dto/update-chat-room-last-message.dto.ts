import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { UserRole } from 'src/domain/auth/enums/user-role.enum';

export class UpdateChatRoomLastMessageDto {
  @IsUUID(4)
  @IsNotEmpty({ message: '채팅방 ID는 필수 입력 항목입니다.' })
  chatRoomId: string;

  @IsString()
  @IsNotEmpty({ message: '메시지는 필수 입력 항목입니다.' })
  message: string;

  @IsEnum(UserRole)
  @IsNotEmpty({ message: '보낸 사람 타입은 필수 입력 항목입니다.' })
  senderType: UserRole;

  @IsUUID(4)
  @IsNotEmpty({ message: '보낸 사람 ID는 필수 입력 항목입니다.' })
  senderId: string;
}
