import { ApiProperty } from '@nestjs/swagger';
import { EventErrorCode } from '../../enums/chat-error-code.enum';

export class HeartbeatFailedResponseDto {
  @ApiProperty({
    description: '에러 코드',
    example: EventErrorCode.USER_NOT_FOUND,
  })
  code: EventErrorCode;

  @ApiProperty({
    description: '에러 메시지',
    example: 'User not found for socket {socketId}',
  })
  message: string;
}
