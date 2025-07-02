import { ApiProperty } from '@nestjs/swagger';

export class HeartbeatSuccessResponseDto {
  @ApiProperty({
    description: '유저 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: '소켓 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  socketId: string;
}
