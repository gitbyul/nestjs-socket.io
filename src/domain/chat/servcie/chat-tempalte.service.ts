import { Injectable } from '@nestjs/common';
import { Author } from 'src/domain/user/entity/Author.entity';
import { Advertisers } from 'src/domain/user/entity/Advertisers.entity';
import { ChatTemplateCode } from '../enums/chat-template-code';
import { SystemMessageDto } from '../dto/system-message.dto';
import { ChatTemplateRepository } from '../repository/chat-templates.repository';

@Injectable()
export class ChatTemplateService {
  constructor(
    private readonly chatTemplateRepository: ChatTemplateRepository,
  ) {}
  async initTemplate(templateCode: ChatTemplateCode) {
    const template =
      await this.chatTemplateRepository.findTemplateByCode(templateCode);
    return template;
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
    author: Author,
    advertiser: Advertisers,
  ) {
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
    templateCode: ChatTemplateCode,
  ) {
    const noticeTemplate =
      await this.chatTemplateRepository.findNoticeByCode(templateCode);
    console.log(noticeTemplate);
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
    templateCode: ChatTemplateCode,
  ) {
    const buttonTemplate =
      await this.chatTemplateRepository.findButtonByCode(templateCode);
    console.log(buttonTemplate);
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
