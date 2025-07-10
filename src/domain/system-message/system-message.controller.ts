import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseEntity } from 'src/config/entity/Response.entity';
import { SystemMessageService } from './service/system-message.service';
import { SystemMessageRequestDto } from './request/system-message.request';
import { LogHttpInterceptor } from 'src/config/log/log-http.interceptor';
import { ApiCommonResponse } from 'src/config/openapi/decorator/api-common-response.decorater';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChatEventEmitter } from '../event/enums/event-emitter-type.enum';
import { LogUtil } from 'src/config/log/log.util';

@Controller('system-message')
@ApiTags('System Message')
@UseInterceptors(LogHttpInterceptor)
@ApiConsumes('application/json')
@ApiCommonResponse({
  includeAuth: false,
  includeValidation: true,
})
@ApiResponse({ status: 200, description: '시스템 메시지 생성 성공' })
export class SystemMessageController {
  constructor(
    private readonly logUtil: LogUtil,
    private readonly systemMessageService: SystemMessageService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post('')
  async createSystemMessage(
    @Body() createSystemMessageDto: SystemMessageRequestDto,
  ) {
    try {
      this.logUtil.HttpInfo(
        `Starting system message creation for chatRoom: [${createSystemMessageDto.templateCode}]${createSystemMessageDto.chatRoomId}`,
      );

      const { chatRoomId, templateCode, links, filesIdList } =
        createSystemMessageDto;

      const result = await this.systemMessageService.createSystemMessage(
        chatRoomId,
        templateCode,
      );

      let { systemMessageDto } = result;
      const { isLink, isFile } = result;
      if (isLink && links) {
        systemMessageDto = this.systemMessageService.addLinks(
          systemMessageDto,
          links,
        );
      }

      if (isFile && filesIdList) {
        systemMessageDto = await this.systemMessageService.addFiles(
          systemMessageDto,
          filesIdList,
        );
      }

      const eventId = crypto.randomUUID();
      this.eventEmitter.emit(ChatEventEmitter.SEND_SYSTEM_MESSAGE, {
        eventId: eventId,
        senderType: result.senderType,
        senderId: result.senderId,
        chatRoomId: chatRoomId,
        systemMessage: systemMessageDto,
      });

      return ResponseEntity.success({
        event: ChatEventEmitter.SEND_SYSTEM_MESSAGE,
        eventId,
      });
    } catch (error) {
      this.logUtil.HttpError(error);
      return ResponseEntity.error(error);
    }
  }
}
