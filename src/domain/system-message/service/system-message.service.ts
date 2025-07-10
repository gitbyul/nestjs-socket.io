import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatTemplateCode } from '../../chat/enums/chat-template-code';
import { ChatTemplateService } from '../../chat/servcie/chat-template.service';
import { ChatTemplateRepository } from '../../chat/repository/chat-templates.repository';
import { ChatRoomMemberRepository } from 'src/domain/chat/repository/chat-room-member.repository';
import { UserRole } from 'src/domain/auth/enums/user-role.enum';
import { UserService } from 'src/domain/user/service/user.service';
import { Author } from 'src/domain/user/entity/Author.entity';
import { Advertisers } from 'src/domain/user/entity/Advertisers.entity';
import { SystemMessageDto } from '../dto/system-message.dto';
import { FileRepository } from 'src/domain/file/repository/file.repository';
import { ChatTemplateType } from '../../chat/enums/chat-template-item-type';
import { ChatMessageRepository } from 'src/domain/chat/repository/chat-message.repository';
import { AdProposalService } from 'src/domain/adproposals/service/ad-proposal.service';

@Injectable()
export class SystemMessageService {
  constructor(
    private readonly chatRoomMemberRepository: ChatRoomMemberRepository,
    private readonly chatMessageRepository: ChatMessageRepository,
    private readonly chatTemplateRepository: ChatTemplateRepository,
    private readonly fileRepository: FileRepository,
    private readonly chatTemplateService: ChatTemplateService,
    private readonly userService: UserService,
    private readonly adProposalService: AdProposalService,
  ) {}

  /**
   * 시스템 메시지 생성
   * @param chatRoomId 채팅방 ID
   * @param templateCode 템플릿 코드
   * @returns 시스템 메시지
   */
  async createSystemMessage(
    chatRoomId: string,
    templateCode: ChatTemplateCode,
  ) {
    // 광고 제안서 찾기
    const adProposal =
      await this.adProposalService.getAdProposalByChatRoomId(chatRoomId);

    if (!adProposal) {
      throw new NotFoundException('AdProposal not found');
    }

    // 채팅방 멤버 찾기
    const chatRoomMembers =
      await this.chatRoomMemberRepository.getChatRoomMemberList(chatRoomId);

    // 작가 멤버 Id 찾기
    const authorMemberId = chatRoomMembers.find(
      (member) => member.memberType === UserRole.AUTHOR,
    )?.memberId;
    const advertiserMemberId = chatRoomMembers.find(
      (member) => member.memberType === UserRole.ADVERTISER,
    )?.memberId;

    if (!authorMemberId || !advertiserMemberId) {
      throw new NotFoundException('MemberId not found');
    }

    // 작가 멤버 찾기
    const authorMember = await this.userService.getUserById(
      authorMemberId,
      UserRole.AUTHOR,
    );
    const advertiserMember = await this.userService.getUserById(
      advertiserMemberId,
      UserRole.ADVERTISER,
    );

    if (!authorMember || !advertiserMember) {
      throw new NotFoundException('Member not found');
    }

    // 템플릿 찾기
    const templateEntity =
      await this.chatTemplateService.initTemplate(templateCode);
    if (templateEntity.length === 0) {
      throw new NotFoundException(`[${templateCode}] Template not found`);
    }

    // 기본 템플릿 찾기
    const defaultTemplate = templateEntity.find(
      (t) => t.type === ChatTemplateType.TEMPLATE,
    );
    const noticeTemplate = templateEntity.find(
      (t) => t.type === ChatTemplateType.NOTICE,
    );
    const buttonTemplate = templateEntity.filter(
      (t) => t.type === ChatTemplateType.BUTTON,
    );

    if (!defaultTemplate) {
      throw new NotFoundException(
        `[${templateCode}] Default Template not found`,
      );
    }

    // 템플릿 발신자
    const { senderType, senderId } = this.chatTemplateService.initSender(
      templateCode,
      authorMember as Author,
      advertiserMember as Advertisers,
    );

    let systemMessageDto = new SystemMessageDto();
    systemMessageDto.title = defaultTemplate.title;
    systemMessageDto.content = defaultTemplate.content;

    // 템플릿 제목 초기화 (Title)
    systemMessageDto = this.chatTemplateService.initTitle(
      systemMessageDto,
      adProposal,
      authorMember as Author,
      advertiserMember as Advertisers,
    );

    // 템플릿 내용 초기화 (Content)
    systemMessageDto = this.chatTemplateService.initContent(
      systemMessageDto,
      authorMember as Author,
      advertiserMember as Advertisers,
    );

    // 템플릿 공지 초기화 (Notice)
    systemMessageDto = this.chatTemplateService.initNotice(
      systemMessageDto,
      noticeTemplate,
    );

    // 템플릿 버튼 초기화 (Buttons)
    systemMessageDto = this.chatTemplateService.initButtons(
      systemMessageDto,
      buttonTemplate,
    );

    return {
      senderType,
      senderId,
      systemMessageDto,
      isLink: defaultTemplate.isLink,
      isFile: defaultTemplate.isFile,
    };
  }

  /**
   * 시스템 메시지 링크 추가
   * @param systemMessageDto 시스템 메시지 객체
   * @param links 링크 목록
   * @returns 시스템 메시지 객체
   */
  addLinks(
    systemMessageDto: SystemMessageDto,
    links: { title: string; url: string }[],
  ) {
    systemMessageDto.links = links;
    return systemMessageDto;
  }

  /**
   * 시스템 메시지 파일 추가
   * @param systemMessageDto 시스템 메시지 객체
   * @param filesIdList 파일 ID 목록
   * @returns 시스템 메시지 객체
   */
  async addFiles(
    systemMessageDto: SystemMessageDto,
    filesIdList: { fileId: string }[],
  ) {
    const files = await this.fileRepository.findByFileIdIn({
      fileIds: filesIdList.map((file) => file.fileId),
    });
    systemMessageDto.files = files.map((file) => ({
      originalName: file.originalFilename,
      fileId: file.id,
      size: file.size ?? 0,
    }));

    return systemMessageDto;
  }
}
