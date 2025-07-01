import { Injectable } from '@nestjs/common';
import { S3Service } from './s3.service';
import { FileUploadType } from '../enums/file-upload-type.enums';

@Injectable()
export class ChatS3Service extends S3Service {
  constructor() {
    super();
  }

  /**
   * 채팅 파일 업로드
   * @param fileStream 파일 스트림
   * @param senderId 발신자 ID
   * @returns 업로드 결과
   */
  async uploadFileToS3WithFileTypeChat(
    fileStream: Express.Multer.File,
    senderId: string,
  ) {
    return await this.uploadS3ToFileStream({
      fileStream,
      fileUploadType: FileUploadType.CHAT,
      entityId: senderId,
    });
  }
}
