import { Injectable } from '@nestjs/common';
import { Author } from 'src/domain/user/entity/Author.entity';
import { Advertisers } from 'src/domain/user/entity/Advertisers.entity';
import { ChatTemplateCode } from '../enums/chat-template-code';
import { SystemMessageDto } from '../../system-message/dto/system-message.dto';
import { ChatTemplateRepository } from '../repository/chat-templates.repository';
import { AdProposals } from 'src/domain/adproposals/entity/AdProposals.entity';
import { ChatTemplates } from '../entity/ChatTemplates.entity';
import {
  ChatTemplateButtonLocationEnum,
  ChatTemplateNoticeType,
} from '../enums/chat-template-item-type';
import { UserRole } from 'src/domain/auth/enums/user-role.enum';

@Injectable()
export class ChatTemplateService {
  constructor(
    private readonly chatTemplateRepository: ChatTemplateRepository,
  ) {}
  async initTemplate(templateCode: ChatTemplateCode) {
    const templates =
      await this.chatTemplateRepository.findByCode(templateCode);
    return templates;
  }

  /**
   * 템플릿 발신자 초기화
   * @param systemMessageDto 채팅 템플릿
   * @param templateCode 템플릿 코드
   * @returns 채팅 템플릿
   */
  initSender(
    templateCode: ChatTemplateCode,
    author: Author,
    advertiser: Advertisers,
  ) {
    const senderType = templateCode.split('_')[0] as UserRole;
    let senderId: string | null = null;

    if (senderType === UserRole.AUTHOR) {
      senderId = author.id;
    } else if (senderType === UserRole.ADVERTISER) {
      senderId = advertiser.id;
    }
    return {
      senderType,
      senderId,
    };
  }

  /**
   * 템플릿 제목 초기화
   * @param template 채팅 템플릿
   * @param author 작가
   * @param advertiser 회사
   * @returns 채팅 템플릿
   */
  initTitle(
    systemMessageDto: SystemMessageDto,
    adProposal: AdProposals,
    author: Author,
    advertiser: Advertisers,
  ) {
    systemMessageDto.title = systemMessageDto.title.replace(
      '[광고명]',
      adProposal.title,
    );
    systemMessageDto.title = systemMessageDto.title.replace(
      '[회사명]',
      advertiser.bizName,
    );
    systemMessageDto.title = systemMessageDto.title.replace(
      '[작가명]',
      author.nickName,
    );

    return systemMessageDto;
  }

  /**
   * 템플릿 내용 초기화
   * @param template 채팅 템플릿
   * @param author 작가
   * @param advertiser 회사
   * @returns 채팅 템플릿
   */
  initContent(
    systemMessageDto: SystemMessageDto,
    author: Author,
    advertiser: Advertisers,
  ) {
    systemMessageDto.content = systemMessageDto.content.replace(
      '[회사명]',
      advertiser.bizName,
    );
    systemMessageDto.content = systemMessageDto.content.replace(
      '[작가명]',
      author.nickName,
    );

    return systemMessageDto;
  }

  /**
   * 템플릿 Notice 초기화
   * @param template 채팅 템플릿
   * @param templateCode 템플릿 코드
   * @returns 채팅 템플릿
   */
  async initNotice(
    systemMessageDto: SystemMessageDto,
    noticeTemplate?: ChatTemplates,
  ) {
    if (!noticeTemplate) {
      return systemMessageDto;
    }

    systemMessageDto.notice = {
      type: noticeTemplate.actionType as ChatTemplateNoticeType,
      message: noticeTemplate.content,
    };

    return systemMessageDto;
  }

  /**
   * 템플릿 버튼 초기화
   * @param template 채팅 템플릿
   * @param templateCode 템플릿 코드
   * @returns 채팅 템플릿
   */
  async initButtons(
    systemMessageDto: SystemMessageDto,
    buttonTemplate?: ChatTemplates[],
  ) {
    if (!buttonTemplate || buttonTemplate.length === 0) {
      return systemMessageDto;
    }
    systemMessageDto.buttons = [];
    buttonTemplate.forEach((button) => {
      const buttonItem = {
        btnLocation: button.actionType as ChatTemplateButtonLocationEnum,
        text: button.content,
        url: button.url ?? undefined,
      };
      systemMessageDto.buttons?.push(buttonItem);
    });

    return systemMessageDto;
  }

  /**
   * 템플릿 링크 추가
   * @param template 채팅 템플릿
   * @returns 채팅 템플릿
   */
  addLinks(
    systemMessageDto: SystemMessageDto,
    links: { title: string; url: string }[],
  ) {
    if (systemMessageDto.links) {
      systemMessageDto.links.push(...links);
    } else {
      systemMessageDto.links = links;
    }

    return systemMessageDto;
  }

  /**
   * 템플릿 파일 추가
   * @param template 채팅 템플릿
   * @returns 채팅 템플릿
   */
  addFiles(
    systemMessageDto: SystemMessageDto,
    files: { originalName: string; fileId: string; size: number }[],
  ) {
    if (systemMessageDto.files) {
      systemMessageDto.files.push(...files);
    } else {
      systemMessageDto.files = files;
    }

    return systemMessageDto;
  }
}
