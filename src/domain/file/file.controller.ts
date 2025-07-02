import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { ApiCommonResponse } from 'src/config/openapi/api-common-response.decorater';
import { LogFileInterceptor } from 'src/config/log/log-file.interceptor';
import { HttpAuthGuard } from '../auth/guard/http-auth.guard';
import { UploadService } from './service/upload.service';
import { LogUtil } from 'src/config/log/log.util';
import { ResponseEntity } from 'src/config/entity/Response.entity';
import { FileUploadResponseDto } from './response/file-upload.response';
import { FileUploadRequestDto } from './request/file-upload.request';
import { AuthRequest } from '../auth/interface/auth-request.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChatEventEmitter } from '../event/enums/event-emitter-type.enum';
@Controller('file')
@UseGuards(HttpAuthGuard)
@ApiBearerAuth()
export class FileController {
  constructor(
    private readonly logUtil: LogUtil,
    private readonly uploadService: UploadService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post('chat/upload')
  @UseInterceptors(FileInterceptor('file'))
  @UseInterceptors(LogFileInterceptor)
  @ApiTags('File')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '채팅 파일 업로드',
    description: `
    WebSocket에 접속된 클라이언트만 파일 메시지 전송 이벤트 처리 가능
    
    파일 메시지 전송 이벤트 처리 이벤트 리스너 참고
    [성공 처리]
    - @websocketListener send-message-success 파일 메시지 전송 성공
    - @websocketListener new-message 새 파일 메시지 수신
    - @websocketListener unread-count-updated 읽지 않은 메시지 수 업데이트
    [실패 처리]
    - @websocketListener send-message-failed 파일 메시지 전송 실패
    `,
  })
  @ApiCommonResponse({
    includeAuth: true,
    includeValidation: true,
  })
  @ApiOkResponse({
    description: '파일 업로드 성공',
    type: FileUploadResponseDto,
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: FileUploadRequestDto,
    @Req() req: AuthRequest,
  ): Promise<ResponseEntity<FileUploadResponseDto>> {
    const user = req.user;
    if (user.id !== body.senderId) {
      throw new BadRequestException('Sender ID does not match');
    }

    this.logUtil.HttpInfo(
      `Starting file upload for user: ${user.id}, chatRoom: ${body.chatRoomId}`,
    );

    const fileEntity = await this.uploadService.chatFileUploadFile(file, {
      chatRoomId: body.chatRoomId,
    });

    const eventId = crypto.randomUUID();
    this.eventEmitter.emit(ChatEventEmitter.SEND_FILE_MESSAGE, {
      eventId: eventId,
      chatRoomId: body.chatRoomId,
      fileId: fileEntity.id,
      senderId: user.id,
      senderType: user.role,
    });

    this.logUtil.info(
      `[FileController] uploadFile - fileId: ${fileEntity.id}, fileUrl: ${fileEntity.url}`,
    );
    return ResponseEntity.success({
      eventId,
    });
  }
}
