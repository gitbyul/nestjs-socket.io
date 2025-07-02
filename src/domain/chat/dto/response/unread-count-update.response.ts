import { ApiProperty } from '@nestjs/swagger';

export class UnreadCountUpdatedResponseDto {
  @ApiProperty({
    description: '채팅방 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  chatRoomId: string;

  @ApiProperty({
    description: '읽지 않은 메시지 수',
    example: 1,
  })
  unreadCount: number;

  @ApiProperty({
    description: '업데이트일',
    example: new Date(),
  })
  updatedAt: Date;
}
