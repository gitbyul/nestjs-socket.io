import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ChatRooms } from '../entity/ChatRooms.entity';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectRepository(ChatRooms)
    private chatRoomsRepository: Repository<ChatRooms>,
  ) {}
}
