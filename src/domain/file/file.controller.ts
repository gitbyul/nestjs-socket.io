import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './service/upload.service';
import { ResponseEntity } from 'src/config/entity/Response.entity';
import { LogFileInterceptor } from 'src/config/log/log-file.interceptor';
import { FileUploadRequestDto } from './request/file-upload.request';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileUploadResponseDto } from './response/file-upload.response';
import { ApiCommonResponse } from 'src/config/openapi/api-common-response.decorater';

@Controller()
export class FileController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @UseInterceptors(LogFileInterceptor)
  @ApiTags('File')
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '파일 업로드',
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
  ) {
    const { Key, Location } = await this.uploadService.uploadFile(file, {
      id: body.senderId,
      type: body.senderType,
    });

    return ResponseEntity.success(FileUploadResponseDto.of(Key, Location));
  }
}
