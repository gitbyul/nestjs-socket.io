import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Response } from 'express';

import { RBAC } from '../auth/decorator/rbac.decorator';
import { ApiCommonResponse } from 'src/config/openapi/decorator/api-common-response.decorater';
import { LogFileInterceptor } from 'src/config/log/log-file.interceptor';
import { ResponseEntity } from 'src/config/entity/Response.entity';
import { LogUtil } from 'src/config/log/log.util';
import { FileService } from './service/file.service';
import { FileRepository } from './repository/file.repository';

import { FileUploadResponseDto } from './response/file-upload.response';
import { FileUploadRequestDto } from './request/file-upload.request';
import { AuthRequest } from '../auth/interface/auth-request.interface';
import { ChatEventEmitter } from '../event/enums/event-emitter-type.enum';
import { UserRole } from '../auth/enums/user-role.enum';
import { LogHttpInterceptor } from 'src/config/log/log-http.interceptor';
import { HttpAuthGuard } from '../auth/guard/http-auth.guard';
import { RbacGuard } from '../auth/guard/rbac.guard';

@Controller('file')
@ApiBearerAuth()
@ApiTags('File')
export class FileController {
  constructor(
    private readonly logUtil: LogUtil,
    private readonly fileService: FileService,
    private readonly fileRepository: FileRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post('chat/upload')
  @RBAC([UserRole.ADMIN, UserRole.ADVERTISER, UserRole.AUTHOR])
  @UseGuards(HttpAuthGuard, RbacGuard)
  @UseInterceptors(FileInterceptor('file'), LogFileInterceptor)
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

    const fileEntity = await this.fileService.chatFileUploadFile(file, {
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

  @Get('/chat/download')
  @RBAC([UserRole.ADMIN, UserRole.ADVERTISER, UserRole.AUTHOR])
  @UseGuards(HttpAuthGuard, RbacGuard)
  @UseInterceptors(LogHttpInterceptor)
  @ApiOperation({
    summary: '채팅 파일 다운로드',
    description: `
    WebSocket에 접속된 클라이언트만 파일 메시지 전송 이벤트 처리 가능
    `,
  })
  @ApiCommonResponse({
    includeAuth: true,
    includeValidation: true,
  })
  @ApiQuery({
    name: 'fileId',
    type: String,
    description: '파일 ID',
  })
  @ApiQuery({
    name: 'chatRoomId',
    type: String,
    description: '채팅방 ID',
  })
  async downloadFile(
    @Query('fileId') fileId: string,
    @Query('chatRoomId') chatRoomId: string,
    @Req() req: AuthRequest,
    @Res() res: Response,
  ) {
    const user = req.user;
    await this.fileService.validateFileBelongsToChatRoom(
      fileId,
      user.id,
      chatRoomId,
    );

    const { file, webStream } =
      await this.fileService.getS3FileWithWebStreamAndFileEntity(fileId);

    const headers = {
      'Content-Type': file.mimetype,
      'Content-Disposition': `attachment; filename="${encodeURIComponent(file.originalFilename)}"`,
      'Content-Length': file.size?.toString() || '',
      'Cache-Control': 'no-cache',
      'Transfer-Encoding': 'chunked',
    };

    res.set(headers);
    await webStream.pipeTo(
      new WritableStream({
        write(chunk) {
          res.write(chunk);
        },
        close() {
          res.end();
        },
        abort() {
          throw new InternalServerErrorException('File stream aborted');
        },
      }),
    );
  }
}
