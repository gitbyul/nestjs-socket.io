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
@Controller('file')
@UseGuards(HttpAuthGuard)
@ApiBearerAuth()
export class FileController {
  constructor(
    private readonly logUtil: LogUtil,
    private readonly uploadService: UploadService,
  ) {}

  @Post('chat/upload')
  @UseInterceptors(FileInterceptor('file'))
  @UseInterceptors(LogFileInterceptor)
  @ApiTags('File')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '채팅 파일 업로드',
    description:
      '파일 저장 이후 반환 받은 파일 아이디와 파일 접근 URL을 WebSocket으로 `chat-message-file-upload` 이벤트로 전송 필요',
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
  ) {
    const user = req.user;
    if (user.id !== body.senderId) {
      throw new BadRequestException('Sender ID does not match');
    }
    const { fileId, url } = await this.uploadService.chatFileUploadFile(file, {
      id: body.senderId,
      type: body.senderType,
    });

    this.logUtil.info(
      `[FileController] uploadFile - fileId: ${fileId}, url: ${url}`,
    );
    return ResponseEntity.success({ fileId, url });
  }
}
