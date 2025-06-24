import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ChatRoomMembers } from '../entity/ChatRoomMembers.entity';

@Injectable()
export class ChatRoomMemberService {
  constructor(
    @InjectRepository(ChatRoomMembers)
    private chatRoomMembersRepository: Repository<ChatRoomMembers>,
  ) {}
}
