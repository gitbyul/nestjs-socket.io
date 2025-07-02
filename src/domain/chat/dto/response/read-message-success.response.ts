import { UserRole } from 'src/domain/auth/enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ReadMessageSuccessResponseDto {
  @ApiProperty({
    description: '채팅방 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  chatRoomId: string;

  @ApiProperty({
    description: '메시지 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  messageId: string;

  @ApiProperty({
    description: '읽은 사람 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  readerId: string;

  @ApiProperty({
    description: '읽은 사람 타입',
    example: UserRole.ADVERTISER,
  })
  readerType: UserRole;

  @ApiProperty({
    description: '생성일',
    example: new Date(),
  })
  createdAt: Date;
}
