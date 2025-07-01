import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { UserRole } from 'src/domain/auth/enums/user-role.enum';

export class FileUploadRequestDto {
  @IsUUID(4)
  @IsNotEmpty({ message: '보내는 사람 ID는 필수 입력 항목입니다.' })
  senderId: string;

  @IsEnum(UserRole)
  @IsNotEmpty({ message: '보내는 사람 타입은 필수 입력 항목입니다.' })
  senderType: UserRole;
}
