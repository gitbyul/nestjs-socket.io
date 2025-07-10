import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LogUtil } from 'src/config/log/log.util';
import { ChatRoomRepository } from '../chat/repository/chat-room.repository';

@Injectable()
export class ChatScheduling {
  constructor(
    private readonly logUtil: LogUtil,
    private readonly chatRoomRepository: ChatRoomRepository,
  ) {}

  /**
   * 채팅방 비활성화
   * 매 시간 마다 채팅방 비활성화 예약 시간이 지난 채팅방 비활성화 처리
   * @Cron "0 0-23/1 * * *"
   */
  @Cron(CronExpression.EVERY_HOUR)
  async deactivateChatRoom() {
    try {
      this.logUtil.SchedulingInfo(
        `[${CronExpression.EVERY_HOUR}] Deactivation scheduled chat rooms`,
      );
      // 채팅방 비활성화 예약 시간이 지난 채팅방 목록 조회
      const chatRooms =
        await this.chatRoomRepository.getChatRoomListByDeactivationScheduledAt();

      // 채팅방 비활성화 처리
      for (const chatRoom of chatRooms) {
        await this.chatRoomRepository.updateChatRoom(chatRoom.id, {
          alive: false,
        });
      }

      this.logUtil.SchedulingSuccess(
        `Deactivation scheduled chat rooms: ${chatRooms.length}`,
      );
    } catch (error) {
      const errorMessage = error.message ?? error;
      this.logUtil.SchedulingError(`Scheduling failed: ${errorMessage}`);
    }
  }
}
