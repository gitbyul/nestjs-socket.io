import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/domain/auth/enums/user-role.enum';

export class GetChatRoomsSuccessResponseDto {
  @ApiProperty({
    description: '채팅방 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  roomId: string;

  @ApiProperty({
    description: '채팅방 활성화 여부',
    example: true,
  })
  alive: boolean;

  @ApiProperty({
    description: '마지막 메시지',
    example: 'Hello, world!',
  })
  lastMessage: string | null;

  @ApiProperty({
    description: '마지막 메시지 시간',
    example: new Date(),
  })
  lastMessageAt: Date | null;

  @ApiProperty({
    description: '마지막 메시지 보낸 사람',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      role: UserRole.ADVERTISER,
      name: 'John Doe',
      profileImage: 'https://example.com/profile.jpg',
    },
  })
  lastMessageUserInfo: {
    id: string;
    role: UserRole;
    name: string;
    profileImage?: string | null;
  } | null;

  @ApiProperty({
    description: '채팅방 멤버 수',
    example: 2,
  })
  memberCount: number;

  @ApiProperty({
    description: '채팅방 멤버 목록',
    example: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        role: UserRole.ADVERTISER,
        name: 'John Doe',
        profileImage: 'https://example.com/profile.jpg',
      },
    ],
  })
  memberList: {
    id: string;
    role: UserRole;
    name: string;
    profileImage?: string | null;
  }[];

  @ApiProperty({
    description: '생성일',
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정일',
    example: new Date(),
  })
  updatedAt: Date;
}
