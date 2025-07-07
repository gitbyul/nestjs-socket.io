import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatMessageRepository } from '../repository/chat-message.repository';
import { ChatTemplateCode } from '../enums/chat-template-code';
import { ChatTemplateService } from './chat-tempalte.service';
import { ChatTemplateRepository } from '../repository/chat-templates.repository';
import { ChatRoomMemberRepository } from '../repository/chat-room-member.repository';
import { UserRole } from 'src/domain/auth/enums/user-role.enum';
import { UserService } from 'src/domain/user/service/user.service';
import { Author } from 'src/domain/user/entity/Author.entity';
import { Advertisers } from 'src/domain/user/entity/Advertisers.entity';
import { SystemMessageDto } from '../dto/system-message.dto';

@Injectable()
export class SystemMessageService {
  constructor(
    private readonly chatRoomMemberRepository: ChatRoomMemberRepository,
    private readonly chatMessageRepository: ChatMessageRepository,
    private readonly chatTemplateRepository: ChatTemplateRepository,
    private readonly chatTemplateService: ChatTemplateService,
    private readonly userService: UserService,
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
    links?: { title: string; url: string }[],
    files?: { originalName: string; fileId: string; size: number }[],
  ) {
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
    const template = await this.chatTemplateService.initTemplate(templateCode);
    if (!template) {
      throw new NotFoundException(`[${templateCode}] Template not found`);
    }

    let systemMessageDto = new SystemMessageDto();
    systemMessageDto.title = template.title;
    systemMessageDto.content = template.content;

    // 템플릿 제목 초기화 (Title)
    systemMessageDto = this.chatTemplateService.initTitle(
      systemMessageDto,
      authorMember as Author,
      advertiserMember as Advertisers,
    );

    // 템플릿 내용 초기화 (Content)
    systemMessageDto = this.chatTemplateService.initContent(
      systemMessageDto,
      authorMember as Author,
      advertiserMember as Advertisers,
    );

    // 템플릿 액션 타입 초기화 (ActionType)
    systemMessageDto = await this.chatTemplateService.initNotice(
      systemMessageDto,
      templateCode,
    );

    // 템플릿 버튼 초기화 (Buttons)
    systemMessageDto = await this.chatTemplateService.initButtons(
      systemMessageDto,
      templateCode,
    );

    // 템플릿 링크 추가 (Links)
    if (links) {
      systemMessageDto = this.chatTemplateService.addLinks(
        systemMessageDto,
        links,
      );
    }

    // 템플릿 파일 추가 (Files)
    if (files) {
      systemMessageDto = this.chatTemplateService.addFiles(
        systemMessageDto,
        files,
      );
    }

    return template;
  }
}
