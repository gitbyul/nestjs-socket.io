import { ApiProperty } from '@nestjs/swagger';
import { EventErrorCode } from '../../enums/chat-error-code.enum';

export class ReadMessageFailedResponseDto {
  @ApiProperty({
    description: '에러 코드',
    example: EventErrorCode.INTERNAL_ERROR,
  })
  code: EventErrorCode;

  @ApiProperty({
    description: '에러 메시지',
    example: 'Internal server error',
  })
  message: string;
}
