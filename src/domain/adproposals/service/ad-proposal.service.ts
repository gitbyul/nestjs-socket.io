import { Injectable, NotFoundException } from '@nestjs/common';
import { AdProposalRepository } from '../repository/ad-proposal.repository';
import { ChatRoomRepository } from 'src/domain/chat/repository/chat-room.repository';
import { ChatRoomType } from 'src/domain/chat/enums/chat-room-type.enums';

@Injectable()
export class AdProposalService {
  constructor(
    private readonly adProposalRepository: AdProposalRepository,
    private readonly chatRoomRepository: ChatRoomRepository,
  ) {}

  async getAdProposalByChatRoomId(chatRoomId: string) {
    const chatRoom = await this.chatRoomRepository.getChatRoomById(chatRoomId);
    const adProposalId =
      chatRoom.chatRoomType === ChatRoomType.AD_PROPOSAL
        ? chatRoom.chatRoomRelatedId
        : null;
    if (!adProposalId) {
      throw new NotFoundException('광고 제안서를 찾을 수 없습니다.');
    }
    return this.adProposalRepository.findByAdProposalId(adProposalId);
  }
}
