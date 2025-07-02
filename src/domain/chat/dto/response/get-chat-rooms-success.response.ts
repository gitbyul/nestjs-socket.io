import { ApiProperty } from '@nestjs/swagger';
import { ChatRooms } from '../../entity/ChatRooms.entity';
import { ChatRoomType } from '../../enums/chat-room-type.enums';
import { UserRole } from 'src/domain/auth/enums/user-role.enum';

export class GetChatRoomsSuccessResponseDto {
  @ApiProperty({
    description: '채팅방 목록',
    type: [ChatRooms],
    example: [
      {
        id: '8715c14e-916d-4a39-86af-ed877ffdd801',
        chatRoomType: ChatRoomType.AD_PROPOSAL,
        chatRoomRelatedId: '272de614-ac1c-4e1b-8bef-978660087b73',
        operatorId: '57541bef-91f0-43d9-9fbe-884150bd7f54',
        operatorType: UserRole.ADVERTISER,
        alive: true,
        deactivationScheduledAt: null,
        deactivationReason: null,
        lastMessageAt: '2025-07-02T04:53:29.000Z',
        lastMessage: '963e8516-59e4-40be-9e66-39f59152f507.webp',
        lastMessageByRole: UserRole.ADVERTISER,
        lastMessageById: '57541bef-91f0-43d9-9fbe-884150bd7f54',
        createdAt: '2025-06-26T07:36:22.000Z',
        updatedAt: '2025-07-02T04:53:29.000Z',
        chatRoomMembers: [
          {
            id: 'eae2ffad-ba3b-499c-b787-d319b2e9404a',
            memberType: UserRole.ADVERTISER,
            memberId: '57541bef-91f0-43d9-9fbe-884150bd7f54',
            unreadMessageCount: 0,
            lastReadMessageId: '9d6131a0-d724-4b9b-9fc2-9492b3b997fa',
            lastReadAt: '2025-07-02T04:53:29.000Z',
            alive: true,
            joinedAt: '2025-06-26T07:36:22.000Z',
            leftAt: null,
          },
          {
            id: 'f33471fa-d8b2-4a1f-bfbc-d0208f3b6d6b',
            memberType: UserRole.AUTHOR,
            memberId: '159b656b-79cb-4dc0-9672-38455c10811d',
            unreadMessageCount: 4,
            lastReadMessageId: '8da829f1-0c20-4caa-966e-399d40a96a4b',
            lastReadAt: '2025-07-02T02:07:29.000Z',
            alive: true,
            joinedAt: '2025-06-26T07:36:22.000Z',
            leftAt: null,
          },
        ],
      },
    ],
  })
  chatRooms: ChatRooms[];
}
