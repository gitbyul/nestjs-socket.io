import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './service/file.service';
import { ResponseEntity } from 'src/config/entity/Reponse.entity';
import { LogFileInterceptor } from 'src/config/log/log-file.interceptor';
import { FileUploadRequestDto } from './request/file-upload.request';

@Controller()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'), LogFileInterceptor)
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: FileUploadRequestDto,
  ) {
    const { Key, Location } = await this.fileService.uploadFile(file, {
      id: body.senderId,
      type: body.senderType,
    });

    return ResponseEntity.of(null, null, {
      key: Key,
      location: Location,
    });
  }
}
