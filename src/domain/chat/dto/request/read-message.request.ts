import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ReadMessageRequestDto {
  @IsUUID(4)
  @IsNotEmpty({ message: '채팅방 ID는 필수 입력 항목입니다.' })
  @ApiProperty({
    description: '채팅방 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  chatRoomId: string;

  @IsUUID(4)
  @IsNotEmpty({ message: '메시지 ID는 필수 입력 항목입니다.' })
  @ApiProperty({
    description: '메시지 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  messageId: string;
}
