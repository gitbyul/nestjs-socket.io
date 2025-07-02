import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { UserRole } from 'src/domain/auth/enums/user-role.enum';

export class FileUploadRequestDto {
  @IsUUID(4)
  @IsNotEmpty({ message: '채팅방 ID는 필수 입력 항목입니다.' })
  @ApiProperty({
    description: '채팅방 ID',
    example: '8715c14e-916d-4a39-86af-ed877ffdd801',
    required: true,
  })
  chatRoomId: string;

  @IsUUID(4)
  @IsNotEmpty({ message: '보내는 사람 ID는 필수 입력 항목입니다.' })
  @ApiProperty({
    description: '보내는 사람 ID',
    example: '57541bef-91f0-43d9-9fbe-884150bd7f54',
    required: true,
  })
  senderId: string;

  @IsEnum(UserRole)
  @IsNotEmpty({ message: '보내는 사람 타입은 필수 입력 항목입니다.' })
  @ApiProperty({
    description: '보내는 사람 타입',
    example: UserRole.ADVERTISER,
    required: true,
  })
  senderType: UserRole;

  @ApiProperty({
    description: '파일',
    type: 'string',
    format: 'binary',
    required: true,
  })
  file: Express.Multer.File;
}
