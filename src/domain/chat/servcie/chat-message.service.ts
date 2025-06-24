import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ChatMessages } from '../entity/ChatMessages.entity';

@Injectable()
export class ChatMessageService {
  constructor(
    @InjectRepository(ChatMessages)
    private chatMessagesRepository: Repository<ChatMessages>,
  ) {}
}
