import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ChatTemplates } from '../entity/ChatTemplates.entity';
import { ChatTemplateCode } from '../enums/chat-template-code';
import { ChatTemplateType } from '../enums/chat-template-item-type';

@Injectable()
export class ChatTemplateRepository {
  constructor(
    @InjectRepository(ChatTemplates)
    private chatTemplatesRepository: Repository<ChatTemplates>,
  ) {}

  /**
   * 템플릿 찾기
   * @param templateCode 템플릿 코드
   * @returns 템플릿
   */
  async findByCode(templateCode: ChatTemplateCode): Promise<ChatTemplates[]> {
    return await this.chatTemplatesRepository.find({
      where: { code: templateCode },
    });
  }

  /**
   * 템플릿 찾기
   * @param templateCode 템플릿 코드
   * @returns 템플릿
   */
  async findTemplateByCode(
    templateCode: ChatTemplateCode,
  ): Promise<ChatTemplates | null> {
    return await this.chatTemplatesRepository.findOne({
      where: { code: templateCode, type: ChatTemplateType.TEMPLATE },
    });
  }

  /**
   * 알림 찾기
   * @param templateCode 템플릿 코드
   * @returns 알림
   */
  async findNoticeByCode(
    templateCode: ChatTemplateCode,
  ): Promise<ChatTemplates | null> {
    return await this.chatTemplatesRepository.findOne({
      where: { code: templateCode, type: ChatTemplateType.NOTICE },
    });
  }

  /**
   * 버튼 찾기
   * @param templateCode 템플릿 코드
   * @returns 버튼
   */
  async findButtonByCode(
    templateCode: ChatTemplateCode,
  ): Promise<ChatTemplates | null> {
    return await this.chatTemplatesRepository.findOne({
      where: { code: templateCode, type: ChatTemplateType.BUTTON },
    });
  }
}
