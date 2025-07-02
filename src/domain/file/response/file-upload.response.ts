import { ApiProperty } from '@nestjs/swagger';

export class FileUploadResponseDto {
  @ApiProperty({
    description: '이벤트 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  eventId: string;
}
