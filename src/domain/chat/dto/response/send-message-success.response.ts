import { ApiProperty } from '@nestjs/swagger';
import { ChatMessageType } from '../../enums/chat-message-type.enum';

export class SendMessageSuccessResponseDto {
  @ApiProperty({
    description: '채팅방 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  chatRoomId: string;

  @ApiProperty({
    description: '메시지',
    example: {
      messageId: '123e4567-e89b-12d3-a456-426614174000',
      message: 'Hello, world!',
    },
  })
  message: { messageId: string; message?: string };

  @ApiProperty({
    description: '파일',
    example: {
      fileId: '123e4567-e89b-12d3-a456-426614174000',
      originalFilename: 'test.png',
      mimetype: 'image/png',
      size: 100,
      path: 'test.png',
      url: 'https://example.com/test.png',
      orderNumber: 1,
    },
  })
  file?: {
    fileId: string;
    originalFilename: string;
    mimetype: string;
    size: number | null;
    path: string;
    url: string;
    orderNumber?: number;
  };

  @ApiProperty({
    description: '메시지 타입',
    example: ChatMessageType.FILE,
  })
  type: ChatMessageType;

  @ApiProperty({
    description: '생성일',
    example: new Date(),
  })
  createdAt: Date;
}
