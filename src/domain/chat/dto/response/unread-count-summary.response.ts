import { ApiProperty } from '@nestjs/swagger';

class UnreadCountSummaryItemDto {
  @ApiProperty({
    description: '채팅방 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  chatRoomId: string;

  @ApiProperty({
    description: '읽지 않은 메시지 수',
    example: 10,
  })
  unreadCount: number;

  @ApiProperty({
    description: '업데이트 일시',
    example: new Date(),
  })
  updatedAt: Date | null;
}

export class UnreadCountSummaryResponseDto {
  @ApiProperty({
    description: '읽지 않은 메시지 수 요약',
    type: [UnreadCountSummaryItemDto],
  })
  summary: UnreadCountSummaryItemDto[];

  @ApiProperty({
    description: '총 읽지 않은 메시지 수',
    example: 10,
  })
  totalUnreadCount: number;
}
