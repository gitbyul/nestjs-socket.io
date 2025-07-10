import { UserRole } from 'src/domain/auth/enums/user-role.enum';
import { ChatMessageType } from '../../enums/chat-message-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { SystemMessageDto } from 'src/domain/system-message/dto/system-message.dto';

export class NewMessageResponseDto {
  @ApiProperty({
    description: '채팅방 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  chatRoomId: string;

  @ApiProperty({
    description: '보낸 사람 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  senderId: string;

  @ApiProperty({
    description: '보낸 사람 타입',
    example: UserRole.ADVERTISER,
  })
  senderType: UserRole;

  @ApiProperty({
    description: '메시지',
    example: {
      messageId: '123e4567-e89b-12d3-a456-426614174000',
      message: 'Hello, world!',
    },
  })
  message: { messageId: string; message?: string };

  @ApiProperty({
    description: '시스템 메시지',
    type: SystemMessageDto,
    required: false,
    example: {
      title: 'Hello, world!',
      content: 'Hello, world!',
      notice: {
        type: 'NOTICE',
        message: 'Hello, world!',
      },
      buttons: [
        {
          text: 'Hello, world!',
          url: 'https://example.com/test.png',
        },
      ],
      links: [
        {
          title: 'Hello, world!',
          url: 'https://example.com/test.png',
        },
      ],
      files: [
        {
          originalName: 'test.png',
          fileId: '123e4567-e89b-12d3-a456-426614174000',
          size: 100,
        },
      ],
    },
  })
  systemMessage?: SystemMessageDto;

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
