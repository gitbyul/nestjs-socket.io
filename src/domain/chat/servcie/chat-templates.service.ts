import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ChatTemplates } from '../entity/ChatTemplates.entity';

@Injectable()
export class ChatTemplateService {
  constructor(
    @InjectRepository(ChatTemplates)
    private chatTemplatesRepository: Repository<ChatTemplates>,
  ) {}
}
