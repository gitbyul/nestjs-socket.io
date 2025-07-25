import { ApiProperty } from '@nestjs/swagger';
import { Files } from 'src/domain/file/entity/Files.entity';

export class GetMessageSuccessResponseDto {
  @ApiProperty({
    description: '메시지 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: '채팅방 정보',
    example: { id: '123e4567-e89b-12d3-a456-426614174000' },
  })
  chatRoom: { id: string };

  @ApiProperty({ description: '메시지 타입', example: 'TEXT' })
  type: string;

  @ApiProperty({ description: '메시지 내용', example: '안녕하세요.' })
  message: string;

  @ApiProperty({
    description: '시스템 메시지',
    example: null,
    nullable: true,
    required: false,
  })
  systemMessage?: string | null;

  @ApiProperty({ description: '발신자 타입', example: 'AUTHOR' })
  senderType: string;

  @ApiProperty({
    description: '발신자 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  senderId: string;

  @ApiProperty({ description: '생성일시', example: '2024-06-01T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '수정일시', example: '2024-06-01T12:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({
    description: '첨부 파일 목록',
    example: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        originalFilename: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 100,
        path: 'https://example.com/test.jpg',
        url: 'https://example.com/test.jpg',
        relatedTable: 'chat_message',
        relatedCode: 'chat_message',
        relatedId: '123e4567-e89b-12d3-a456-426614174000',
        orderNumber: 1,
        createdAt: '2024-06-01T12:00:00.000Z',
      },
    ],
    type: [Files],
  })
  files: Files[];
}
